import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import * as moment from 'moment';

import './style.css';
import { getProjectListParseFunction, getTodayTimeEntriesParseFunction } from '../../queries';
import LeftBar from '../../components/LeftBar';
import ManualTimeModal from '../../components/ManualTimeModal';
import addTasks from '../../actions/MainPageAction';
import manualTimerModalAction from '../../actions/ManualTimerModalAction';
import { userLoggedIn } from '../../services/authentication';
import { getDateInString, getTimeDiff, getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { encodeTimeEntryIssue, decodeTimeEntryIssue } from '../../services/timeEntryService';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import {
    removeCurrentTimerFromLocalStorage,
    setCurrentTimerToLocalStorage,
} from '../../services/currentTimerStorageService';
import { setServerClientTimediffToLocalStorage } from '../../services/serverClientTimediffStorageService';
import { AppConfig } from '../../config';

class MainPage extends Component {
    ONE_SECOND_PERIOD = 1000; // in ms
    TIMER_LIVE_SUBSCRIPTION;
    TIMER_MANUAL_UPDATE_SUBSCRIPTION;
    socketConnection;
    issueTargetElement;
    projectListTargetElement;
    projectSearchTextTargetElement;
    defaultProject = {
        id: 'f339b6b6-d044-44f3-8887-684e112f7cfd',
        name: 'any',
        projectColor: {
            name: 'green',
        },
    };
    state = {
        timerReadyToUse: false,
        timerPlayButtonShow: true,
        timerPlayButtonLoader: false,
        timerDurationValue: null,
        timerStartTime: null,
        seletedProject: null,
        timeEntriesList: [],
        projectList: [],
        projectListForModalWindow: [],
        projectListInitial: [],
        projectListIsOpen: false,
    };

    initSocketConnection() {
        this.socketConnection = openSocket(AppConfig.apiURL);
        this.socketConnection.on('connect', () => {
            this.socketConnection.emit(
                'join-v2',
                {
                    userId: getUserIdFromLocalStorage(),
                },
                _ => {
                    this.socketConnection.emit('check-timer-v2', {
                        userId: getUserIdFromLocalStorage(),
                    });
                }
            );
        });
        this.socketConnection.on('check-timer-v2', data => {
            if (data && typeof this.TIMER_MANUAL_UPDATE_SUBSCRIPTION === 'undefined') {
                fetch(AppConfig.apiURL + 'time/current', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
                    .then(res => {
                        if (!res.ok) {
                            throw res;
                        }
                        return res.json();
                    })
                    .then(
                        result => {
                            setServerClientTimediffToLocalStorage(+moment(result.timeISO) - +moment());
                            const currentTimer = {
                                timeStart: +moment(data.startDatetime),
                                issue: decodeTimeEntryIssue(data.issue),
                                project: data.project,
                            };
                            setCurrentTimerToLocalStorage(currentTimer);
                            this.timerStateUpdateWithSocketData(currentTimer);
                        },
                        err => {
                            if (err instanceof Response) {
                                err.text().then(errorMessage => console.log(errorMessage));
                            } else {
                                console.log(err);
                            }
                        }
                    );
            } else if (!data) {
                removeCurrentTimerFromLocalStorage();
                const lastTimeEntry = this.props.timeEntriesList[0];
                const seletedProject = lastTimeEntry ? lastTimeEntry.project : this.defaultProject;
                this.setState({ seletedProject, timerReadyToUse: true });
            }
        });
        this.socketConnection.on('stop-timer-v2', data => {
            clearInterval(this.TIMER_LIVE_SUBSCRIPTION);
            this.TIMER_LIVE_SUBSCRIPTION = undefined;
            this.timerStop();
        });
    }

    timerPlayStopButtonAction(className, projectId) {
        this.setState({ timerPlayButtonLoader: true }, () => {
            if (className === 'control_task_time_icons play') {
                const issue = (this.issueTargetElement || {}).value || '';
                this.socketConnection &&
                    this.socketConnection.emit('start-timer-v2', {
                        userId: getUserIdFromLocalStorage(),
                        issue: encodeTimeEntryIssue(issue),
                        projectId: projectId,
                    });
            } else {
                this.socketConnection &&
                    this.socketConnection.emit('stop-timer-v2', {
                        userId: getUserIdFromLocalStorage(),
                    });
            }
        });
    }

    timerTickStart() {
        clearInterval(this.TIMER_LIVE_SUBSCRIPTION);
        this.TIMER_LIVE_SUBSCRIPTION = undefined;

        this.setState({ timerDurationValue: getTimeDiff(this.state.timerStartTime) });
        this.TIMER_LIVE_SUBSCRIPTION = setInterval(
            () => this.setState({ timerDurationValue: getTimeDiff(this.state.timerStartTime) }),
            this.ONE_SECOND_PERIOD
        );
    }

    timerUpdate() {
        clearTimeout(this.TIMER_MANUAL_UPDATE_SUBSCRIPTION);
        this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = undefined;

        this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = setTimeout(() => {
            if (this.TIMER_LIVE_SUBSCRIPTION) {
                const issue = (this.issueTargetElement || {}).value || '';
                this.socketConnection &&
                    this.socketConnection.emit('update-timer-v2', {
                        userId: getUserIdFromLocalStorage(),
                        issue: encodeTimeEntryIssue(issue),
                        projectId: this.state.seletedProject.id,
                    });
            }

            clearTimeout(this.TIMER_MANUAL_UPDATE_SUBSCRIPTION);
            this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = undefined;
        }, this.ONE_SECOND_PERIOD);
    }

    timerStop() {
        removeCurrentTimerFromLocalStorage();
        this.getUserTimeEntries().then(
            _ => {
                this.setState(
                    {
                        timerPlayButtonShow: !this.state.timerPlayButtonShow,
                        timerPlayButtonLoader: false,
                        timerDurationValue: null,
                        timerStartTime: null,
                    },
                    () => {
                        if (!!this.issueTargetElement) {
                            this.issueTargetElement.value = '';
                        }
                    }
                );
            },
            _ => {}
        );
    }

    timerStateUpdateWithSocketData(socketData) {
        if (!socketData || !socketData.timeStart) {
            return;
        }

        if (!!this.issueTargetElement) {
            this.issueTargetElement.value = socketData.issue;
        }

        this.setState(
            {
                timerPlayButtonShow: false,
                timerPlayButtonLoader: false,
                timerStartTime: socketData.timeStart || +moment(),
                seletedProject: socketData.project,
                timerReadyToUse: true,
            },
            () => this.timerTickStart()
        );
    }

    timerContinue(name, item) {
        this.issueTargetElement.value = name;
        this.setState({ seletedProject: item.project }, () =>
            this.timerPlayStopButtonAction('control_task_time_icons play', item.project.id)
        );
    }

    getTimeEntriesTotalTime(items) {
        let totalTime = 0;
        for (let i = 0; i < items.length; i++) {
            totalTime += +moment(items[i].endDatetime) - +moment(items[i].startDatetime);
        }

        return getDateInString(totalTime);
    }

    projectListToggle() {
        this.setState({ projectListIsOpen: !this.state.projectListIsOpen }, () => {
            if (this.state.projectListInitial) {
                this.findProjectByName();
            }
        });
    }

    setActiveProject(project) {
        this.setState({ seletedProject: project }, () => this.timerUpdate());
    }

    findProjectByName(name = '') {
        if (name.length) {
            name = name.toLowerCase();
            let finishArr = this.state.projectListInitial.filter(it => {
                let values = [];
                values.push(it['name']);

                return (
                    JSON.stringify(values)
                        .toLowerCase()
                        .indexOf(name) > -1
                );
            });
            this.setState({ projectListForModalWindow: finishArr });
        } else {
            this.setState({ projectListForModalWindow: this.state.projectListInitial });
        }
    }

    splitProjectsByDates(items = []) {
        const formattedLogsDates = [];
        const formattedLogsDatesValues = [];

        for (let i = 0; i < items.length; i++) {
            const date = moment(items[i].startDatetime).format('YYYY-MM-DD');
            let index = formattedLogsDates.indexOf(date);
            if (index === -1) {
                formattedLogsDates.push(date);
                index = formattedLogsDates.length - 1;
            }

            if (typeof formattedLogsDatesValues[index] === 'undefined') {
                formattedLogsDatesValues[index] = [];
            }

            formattedLogsDatesValues[index].push(items[i]);
        }

        return formattedLogsDatesValues;
    }

    deleteTimeEntry(item) {
        let check = window.confirm('Do you really want to delete this time entry?');
        if (check) {
            fetch(AppConfig.apiURL + `timer/${item.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then(
                    _ => {
                        this.getUserTimeEntries().then(_ => {}, _ => {});
                    },
                    err => {
                        if (err instanceof Response) {
                            err.text().then(errorMessage => console.log(errorMessage));
                        } else {
                            console.log(err);
                        }
                    }
                );
        }
    }

    getUserTimeEntries() {
        return new Promise((resolve, reject) => {
            fetch(AppConfig.apiURL + `timer/user-list?userId=${getUserIdFromLocalStorage()}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(res => {
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then(
                    result => {
                        const { timerV2: timeEntriesList } = getTodayTimeEntriesParseFunction(result.data);
                        this.props.addTasksAction('ADD_TASKS_ARR', { timeEntriesList });
                        resolve();
                    },
                    err => {
                        if (err instanceof Response) {
                            err.text().then(errorMessage => console.log(errorMessage));
                        } else {
                            console.log(err);
                        }
                        reject();
                    }
                );
        });
    }

    getProjectList() {
        fetch(AppConfig.apiURL + 'project/list', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                result => {
                    let dataParsed = getProjectListParseFunction(result);
                    const projectV2 = dataParsed.projectV2.reverse();
                    this.setState({
                        projectList: projectV2,
                        projectListForModalWindow: projectV2,
                        projectListInitial: projectV2,
                    });
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => console.log(errorMessage));
                    } else {
                        console.log(err);
                    }
                }
            );
    }

    componentDidMount() {
        this.getUserTimeEntries().then(_ => this.initSocketConnection(), _ => {});
        this.getProjectList();
    }

    componentWillUnmount() {
        this.socketConnection && this.socketConnection.emit('leave');
    }

    createTimeEntriesList(data) {
        let items = data.map((item, index) => (
            <div className="ul" key={'time-entries_' + index}>
                <div className="li">
                    <div className="name_container">
                        <div className="name">{item.issue}</div>
                        <div className="project_name">
                            <span className={`circle ${item.project.projectColor.name}`} />
                            <span>{item.project.name}</span>
                        </div>
                    </div>
                    <div className="time_container_history">
                        <div className="time_now">
                            <div>{moment(item.startDatetime).format('HH:mm')}</div>-{' '}
                            <div>{moment(item.endDatetime).format('HH:mm')}</div>
                        </div>
                        <div className="timePassed">
                            {getTimeDurationByGivenTimestamp(+moment(item.endDatetime) - +moment(item.startDatetime))}
                        </div>
                        {!this.state.timerDurationValue && (
                            <i
                                className="small_play item_button"
                                onClick={e => {
                                    this.state.timerReadyToUse && this.timerContinue(item.issue, item);
                                }}
                            />
                        )}
                        <i
                            className="edit_button item_button"
                            onClick={e => {
                                this.props.addTasksAction('SET_EDITED_ITEM', { editedItem: item });
                                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: true });
                            }}
                        />
                        <i className="cancel item_button" onClick={e => this.deleteTimeEntry(item)} />
                    </div>
                </div>
            </div>
        ));

        return items;
    }

    render() {
        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        const buttonState = this.state.timerPlayButtonShow ? 'play' : 'stop';
        const buttonClassName = ['control_task_time_icons', buttonState].join(' ');
        let timeTrackerWrapperItems = this.splitProjectsByDates(this.props.timeEntriesList).map((arraysItem, index) => (
            <div className="time_tracker_wrapper" key={'time-entry-group_' + index}>
                <div className="header">
                    <div className="date">{moment(arraysItem[0].startDatetime).format('DD.MM.YYYY')}</div>
                    <div className="allTime">Total time: {this.getTimeEntriesTotalTime(arraysItem)}</div>
                </div>
                {this.createTimeEntriesList(arraysItem)}
            </div>
        ));

        return (
            <div className="wrapper_main_page">
                <LeftBar />
                <div className="data_container">
                    <div className="add_task_container">
                        {this.props.manualTimerModal.manualTimerModalToggle && (
                            <ManualTimeModal
                                timeEntriesList={this.props.timeEntriesList}
                                editedItem={this.props.editedItem}
                                projectList={this.state.projectListInitial}
                                addTasksAction={this.props.addTasksAction}
                                manualTimerModalAction={this.props.manualTimerModalAction}
                            />
                        )}
                        <input
                            type="text"
                            className="add_task"
                            placeholder="Add your task name"
                            ref={input => {
                                this.issueTargetElement = input;
                            }}
                            onKeyUp={e => this.timerUpdate()}
                        />
                        <div className="time_container">
                            {this.state.timerDurationValue
                                ? getTimeDurationByGivenTimestamp(+moment(this.state.timerDurationValue))
                                : '00:00:00'}
                        </div>
                        {this.state.timerReadyToUse && (
                            <div className="active_project">
                                <span
                                    className={`projects_modal_item_circle ${
                                        this.state.seletedProject.projectColor.name
                                    }`}
                                />
                                <span className="projects_modal_item_name">{this.state.seletedProject.name}</span>
                            </div>
                        )}
                        <i className="folder" onClick={e => this.projectListToggle()}>
                            {this.state.projectListIsOpen && (
                                <div
                                    className="projects_modal_wrapper"
                                    ref={div => (this.projectListTargetElement = div)}
                                >
                                    <div
                                        className="projects_modal_wrapper_header"
                                        onClick={event => {
                                            event.stopPropagation();
                                        }}
                                    >
                                        <input
                                            placeholder="Find..."
                                            type="text"
                                            ref={input => (this.projectSearchTextTargetElement = input)}
                                            onKeyUp={e =>
                                                this.findProjectByName(this.projectSearchTextTargetElement.value)
                                            }
                                            className="projects_modal_wrapper_search"
                                        />
                                    </div>
                                    <div className="projects_modal_data_wrapper">
                                        {this.state.projectListForModalWindow.map((item, index) => (
                                            <div
                                                key={'timer-project-' + index}
                                                className="projects_modal_item"
                                                onClick={e => this.setActiveProject(item)}
                                            >
                                                <div
                                                    className={`projects_modal_item_circle ${item.projectColor.name}`}
                                                />
                                                <div className="projects_modal_item_name">{item.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </i>
                        <i
                            onClick={_ => {
                                this.state.timerReadyToUse &&
                                    this.timerPlayStopButtonAction(buttonClassName, this.state.seletedProject.id);
                            }}
                            className={buttonClassName}
                        />
                    </div>
                    <div className="main_wrapper_tracker_items">{timeTrackerWrapperItems}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        timeEntriesList: store.mainPageReducer.timeEntriesList,
        editedItem: store.mainPageReducer.editedItem,
        manualTimerModal: store.manualTimerModalReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addTasksAction: (actionType, action) => dispatch(addTasks(actionType, action))[1],
        manualTimerModalAction: (actionType, action) => dispatch(manualTimerModalAction(actionType, action))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);
