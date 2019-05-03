import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import * as moment from 'moment';

import './style.css';
import { getDateInString, getTimeDiff } from './timeInSecondsFunction';
import LeftBar from '../../components/LeftBar';
import addTasks from '../../actions/MainPageAction';
import manualTimerModalAction from '../../actions/ManualTimerModalAction';
import ManualTimeModal from '../../components/Manual-time-modal';
import { createArayOfArrays } from './createArrayOfArraysFunction';
import { getProjectListParseFunction, getTodayTimeEntriesParseFunction } from '../../queries';
import { userLoggedIn } from '../../services/authentication';
import { AppConfig } from '../../config';
import { getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { encodeTimeEntryIssue, decodeTimeEntryIssue } from '../../services/timeEntryService';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import {
    removeCurrentTimerFromLocalStorage,
    setCurrentTimerToLocalStorage,
} from '../../services/currentTimerStorageService';
import { setServerClientTimediffToLocalStorage } from '../../services/serverClientTimediffStorageService';

class MainPage extends Component {
    ONE_SECOND = 1000; // in ms
    TIMER_LIVE_SUBSCRIPTION;
    TIMER_MANUAL_UPDATE_SUBSCRIPTION;
    state = {
        classToggle: true,
        time: null,
        seletedProject: {
            id: 'f339b6b6-d044-44f3-8887-684e112f7cfd',
            isActive: true,
            name: 'any',
            projectColor: {
                name: 'green',
            },
        },
        timerStartDateTime: '',
        arrTasks: [],
        arrProjects: [],
        arrProjectsToModal: [],
        arrProjectsEtalon: [],
        projectListOpen: false,
    };
    time = {
        timeStart: '',
        timeFinish: '',
    };

    socket = openSocket(AppConfig.apiURL);

    initSocketConnection = () => {
        this.socket.on('connect', () => {
            this.socket.emit(
                'join-v2',
                {
                    userId: getUserIdFromLocalStorage(),
                },
                _ => {
                    this.socket.emit('check-timer-v2', {
                        userId: getUserIdFromLocalStorage(),
                    });
                }
            );
        });
        this.socket.on('check-timer-v2', data => {
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
                            data.issue = decodeTimeEntryIssue(data.issue);
                            setCurrentTimerToLocalStorage({
                                taskName: data.issue,
                                timeStart: +moment(data.startDatetime),
                                seletedProject: data.project,
                            });
                            this.getTimeNow(
                                {
                                    taskName: data.issue,
                                    timeStart: +moment(data.startDatetime),
                                    seletedProject: data.project,
                                },
                                data
                            );
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
                this.setActiveProject(createArayOfArrays(this.props.arrTasks)[0][0].project)
            }
        });
        this.socket.on('stop-timer-v2', data => {
            clearInterval(this.TIMER_LIVE_SUBSCRIPTION);
            this.TIMER_LIVE_SUBSCRIPTION = undefined;
            this.timerStop();
        });
    };

    projectListeToggle = () => {
        this.setState({ projectListOpen: !this.state.projectListOpen });
        document.addEventListener('click', this.closeDropdown);
    };

    closeDropdown = e => {
        if (this.dropList && !this.dropList.contains(e.target)) {
            this.setState(
                {
                    projectListOpen: !this.state.projectListOpen,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdown);
                }
            );
        }
    };

    saveStartTimer(className, setProjectId = this.state.seletedProject.id) {
        if (className === 'control_task_time_icons play') {
            const issue = (this.mainTaskName || {}).value || '';
            this.socket.emit('start-timer-v2', {
                userId: getUserIdFromLocalStorage(),
                issue: encodeTimeEntryIssue(issue),
                projectId: setProjectId,
            });
        } else {
            this.socket.emit('stop-timer-v2', {
                userId: getUserIdFromLocalStorage(),
            });
        }
    }

    timerStart() {
        this.setState({ timerStartDateTime: +moment() });
        if (this.time.timeStart.length === 0) {
            this.time.timeStart = +moment();
        }

        clearInterval(this.TIMER_LIVE_SUBSCRIPTION);
        this.TIMER_LIVE_SUBSCRIPTION = undefined;

        this.setState({ time: getTimeDiff(this.time.timeStart) });
        this.TIMER_LIVE_SUBSCRIPTION = setInterval(
            () => this.setState({ time: getTimeDiff(this.time.timeStart) }),
            this.ONE_SECOND
        );
    }

    timerUpdate() {
        clearTimeout(this.TIMER_MANUAL_UPDATE_SUBSCRIPTION);
        this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = undefined;

        this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = setTimeout(() => {
            if (this.TIMER_LIVE_SUBSCRIPTION) {
                const issue = (this.mainTaskName || {}).value || '';
                this.socket.emit('update-timer-v2', {
                    userId: getUserIdFromLocalStorage(),
                    issue: encodeTimeEntryIssue(issue),
                    projectId: this.state.seletedProject.id,
                });
            }

            clearTimeout(this.TIMER_MANUAL_UPDATE_SUBSCRIPTION);
            this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = undefined;
        }, this.ONE_SECOND);
    }

    timerStop() {
        this.getTimeForMainPage();
        removeCurrentTimerFromLocalStorage();
        this.setState(state => ({ classToggle: !state.classToggle }));
        this.cleanMainField();
    }

    cleanMainField() {
        this.setState({ time: null });
        this.time.timeFinish = '';
        this.time.timeStart = '';
        setTimeout(() => {
            if (!!this.mainTaskName) {
                this.mainTaskName.value = '';
            }
        }, 500);
    }

    deleteFromArr(item) {
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
                    result => this.getTimeForMainPage(),
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

    getTimeNow(object, data) {
        let timer = object;
        if (!timer || !timer.timeStart) {
            return;
        }
        this.time.timeStart = timer.timeStart;
        this.setState({ time: null });
        this.timerStart();
        this.setState(_ => ({ classToggle: false }));
        this.setOldTaskName(data);
    }

    setOldTaskName(data) {
        if (!data) {
            return;
        }
        if (!!this.mainTaskName) {
            this.mainTaskName.value = data.issue;
        }
        this.setState({ seletedProject: data.project });
    }

    getTimePassed(start, end) {
        return getTimeDurationByGivenTimestamp(+moment(end) - +moment(start));
    }

    componentWillMount() {}

    createItems(arr) {
        let items = arr.map((item, index) => (
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
                        <div className="timePassed">{this.getTimePassed(item.startDatetime, item.endDatetime)}</div>
                        {!this.state.time && (
                            <i
                                className="small_play item_button"
                                onClick={e => {
                                    this.saveOldTask(item.issue, item);
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
                        <i className="cancel item_button" onClick={e => this.deleteFromArr(item)} />
                    </div>
                </div>
            </div>
        ));

        return items;
    }

    saveOldTask(name, item) {
        this.mainTaskName.value = name;
        this.setState({ seletedProject: item.project });
        this.saveStartTimer('control_task_time_icons play', item.project.id);
    }

    getSumTime(arr) {
        let sumTime = 0;
        for (let i = 0; i < arr.length; i++) {
            sumTime += +moment(arr[i].endDatetime) - +moment(arr[i].startDatetime);
        }

        return getDateInString(sumTime);
    }

    setActiveProject(item) {
        this.setState({ seletedProject: item });
        this.timerUpdate();
    }

    getProject(activeProject) {
        if (typeof activeProject !== 'object') {
            return;
        }
        return (
            <div className="active_project">
                <span className={`projects_modal_item_circle ${activeProject.projectColor.name || 'blue'}`} />
                <span className="projects_modal_item_name">{activeProject.name}</span>
            </div>
        );
    }

    findUser(items, searchText, event) {
        if (searchText.length > 1) {
            searchText = searchText.toLowerCase();
            let finishArr = items.filter(it => {
                let values = [];
                values.push(it['name']);

                return (
                    JSON.stringify(values)
                        .toLowerCase()
                        .indexOf(searchText) > -1
                );
            });
            this.setState({ arrProjectsToModal: finishArr });
        } else {
            this.setState({ arrProjectsToModal: this.state.arrProjectsEtalon });
        }
    }

    render() {
        const { classToggle } = this.state;
        const buttonState = classToggle ? 'play' : 'stop';
        const buttonClassName = ['control_task_time_icons', buttonState].join(' ');
        let timeTrackerWrapperItems = createArayOfArrays(this.props.arrTasks).map((arraysItem, index) => (
            <div className="time_tracker_wrapper" key={'time-entry-group_' + index}>
                <div className="header">
                    <div className="date">{moment(arraysItem[0].startDatetime).format('DD.MM.YYYY')}</div>
                    <div className="allTime">Total time: {this.getSumTime(arraysItem)}</div>
                </div>
                {this.createItems(arraysItem)}
            </div>
        ));

        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        return (
            <div className="wrapper_main_page">
                {this.props.manualTimerModal.manualTimerModalToggle && (
                    <ManualTimeModal
                        manualTimerModalAction={this.props.manualTimerModalAction}
                        arrTasks={this.props.arrTasks}
                        editedItem={this.props.editedItem}
                        arrProjects={this.state.arrProjectsEtalon}
                        getTimeForMainPage={this.getTimeForMainPage}
                        addTasksAction={this.props.addTasksAction}
                    />
                )}
                <LeftBar />
                <div className="data_container">
                    <div className="add_task_container">
                        <input
                            type="text"
                            className="add_task"
                            placeholder="Add your task name"
                            ref={input => {
                                this.mainTaskName = input;
                            }}
                            onKeyUp={e => this.timerUpdate()}
                        />
                        <div className="time_container">
                            {this.state.time ? getTimeDurationByGivenTimestamp(+moment(this.state.time)) : '00:00:00'}
                        </div>
                        <div>{this.getProject(this.state.seletedProject)}</div>
                        <i className="folder" onClick={e => this.projectListeToggle()}>
                            {this.state.projectListOpen && (
                                <div className="projects_modal_wrapper" ref={div => (this.dropList = div)}>
                                    <div
                                        className="projects_modal_wrapper_header"
                                        onClick={event => {
                                            event.stopPropagation();
                                        }}
                                    >
                                        <input
                                            placeholder="Find..."
                                            type="text"
                                            ref={input => (this.inputSearchText = input)}
                                            onKeyUp={e =>
                                                this.findUser(
                                                    this.state.arrProjectsEtalon,
                                                    this.inputSearchText.value,
                                                    e
                                                )
                                            }
                                            className="projects_modal_wrapper_search"
                                        />
                                    </div>
                                    <div className="projects_modal_data_wrapper">
                                        {this.state.arrProjectsToModal.map((item, index) => (
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
                            onClick={e => {
                                this.saveStartTimer(buttonClassName);
                            }}
                            className={buttonClassName}
                        />
                    </div>
                    <div className="main_wrapper_tracker_items">{timeTrackerWrapperItems}</div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.initSocketConnection();
        this.getTimeForMainPage();
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
                    this.setState({ arrProjects: dataParsed.projectV2 });
                    this.setState({ arrProjectsToModal: dataParsed.projectV2 });
                    this.setState({ arrProjectsEtalon: dataParsed.projectV2 });
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

    getTimeForMainPage() {
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
                    let data = getTodayTimeEntriesParseFunction(result.data);
                    this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: data.timerV2 });
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

    componentWillUnmount() {
        this.socket.emit('leave');
    }
}

const mapStateToProps = store => {
    return {
        arrTasks: store.mainPageReducer.arrTasks,
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
