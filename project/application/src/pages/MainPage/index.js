import React, { Component } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import * as moment from 'moment';

import './style.css';
import { getDateInString } from './timeInSecondsFunction';
import LeftBar from '../../components/LeftBar';
import addTasks from '../../actions/MainPageAction';
import manualTimerModalAction from '../../actions/ManualTimerModalAction';
import ManualTimeModal from '../../components/Manual-time-modal';
import { client } from '../../requestSettings';
import { createArayOfArrays } from './createArrayOfArraysFunction';
import { getTodayTimeEntries, returnMutationLinkDeleteTimeEntries, getProjectsV2 } from '../../queries';
import { checkAuthentication, getUserId } from '../../services/authentication';
import { AppConfig } from '../../config';

class MainPage extends Component {
    ONE_MINUTE = 1000; // in ms
    TIMER_LIVE_SUBSCRIPTION;
    TIMER_MANUAL_UPDATE_SUBSCRIPTION;
    startTimerInitiator = false;
    stopTimerInitiator = false;
    state = {
        classToggle: true,
        time: moment()
            .set({ hour: 0, minute: 0, second: 0 })
            .format('YYYY-MM-DD HH:mm:ss'),
        date: moment().format('YYYY-MM-DD'),
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

    socket = openSocket(AppConfig.socketURL);

    initSocketConnection = () => {
        this.socket.on('connect', () => {
            this.socket.emit(
                'join-v2',
                {
                    userId: getUserId(),
                },
                _ => {
                    this.socket.emit('check-timer-v2', {
                        userId: getUserId(),
                    });
                }
            );
        });
        this.socket.on('check-timer-v2', data => {
            if (this.startTimerInitiator) {
                this.startTimerInitiator = false;
            }

            if (data) {
                localStorage.setItem(
                    'current-timer',
                    JSON.stringify({
                        taskName: data.issue,
                        timeStart: +moment(data.startDatetime),
                        seletedProject: data.project,
                    })
                );
                this.getTimeNow(
                    {
                        taskName: data.issue,
                        timeStart: +moment(data.startDatetime),
                        seletedProject: data.project,
                    },
                    data
                );
            }
        });
        this.socket.on('stop-timer-v2', data => {
            clearInterval(this.TIMER_LIVE_SUBSCRIPTION);
            this.TIMER_LIVE_SUBSCRIPTION = undefined;
            this.timerStop();
            if (this.stopTimerInitiator) {
                // this.saveTimeEntry(timeEntry);
                this.stopTimerInitiator = false;
            }
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
            this.startTimerInitiator = true;
            this.socket.emit('start-timer-v2', {
                userId: JSON.parse(localStorage.getItem('userObject')).id,
                issue: this.mainTaskName.value,
                projectId: setProjectId,
            });
        } else {
            this.stopTimerInitiator = true;
            this.socket.emit('stop-timer-v2', {
                userId: JSON.parse(localStorage.getItem('userObject')).id,
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
        this.TIMER_LIVE_SUBSCRIPTION = setInterval(() => {
            this.setState(state => ({
                time: moment(state.time).add(1, 'second'),
            }));
        }, this.ONE_MINUTE);
    }

    timerUpdate() {
        clearTimeout(this.TIMER_MANUAL_UPDATE_SUBSCRIPTION);
        this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = undefined;

        this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = setTimeout(() => {
            if (this.TIMER_LIVE_SUBSCRIPTION) {
                this.socket.emit('update-timer', {
                    userId: JSON.parse(localStorage.getItem('userObject')).id,
                    issue: this.mainTaskName.value,
                    projectId: this.state.seletedProject,
                });
            }
        }, 300);
    }

    timerStop() {
        this.getTimeForMainPage();
        localStorage.removeItem('current-timer');
        this.setState(state => ({
            classToggle: !state.classToggle,
        }));
        this.cleanMainField();
    }

    cleanMainField() {
        this.setState({
            time: moment()
                .set({ hour: 0, minute: 0, second: 0 })
                .format('YYYY-MM-DD HH:mm:ss'),
        });
        this.time.timeFinish = '';
        this.time.timeStart = '';
        setTimeout(() => {
            this.mainTaskName.value = '';
        }, 300);
    }

    deleteFromArr(item) {
        let newArr = [];
        for (let i = 0; i < this.props.arrTasks.length; i++) {
            if (this.props.arrTasks[i].id !== item.id) {
                newArr.push(this.props.arrTasks[i]);
            }
        }
        client.request(returnMutationLinkDeleteTimeEntries(item)).then(data => {
            this.getTimeForMainPage();
        });
    }

    getTimeNow(object, data) {
        let timer = object;
        if (!timer || !timer.timeStart) {
            return;
        }
        this.time.timeStart = timer.timeStart;
        let newTime = +moment() - timer.timeStart;
        let timeInArr = moment(newTime + 1000)
            .utc()
            .format('HH:mm:ss')
            .split(':');
        this.setState({
            time: moment()
                .set({ hour: timeInArr[0], minute: timeInArr[1], second: timeInArr[2] })
                .format('YYYY-MM-DD HH:mm:ss'),
        });
        this.timerStart();
        this.setState(state => ({
            classToggle: false,
        }));
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
        return getDateInString(+moment(end) - +moment(start));
    }

    componentWillMount() {}

    createItems(arr) {
        let items = arr.map(item => (
            <div className="ul" key={+moment()}>
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
                        {moment(this.state.time).format('HH:mm:ss') === '00:00:00' && (
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
        let timeTrackerWrapperItems = createArayOfArrays(this.props.arrTasks).map(arraysItem => (
            <div className="time_tracker_wrapper" key={+moment(arraysItem[0].startDatetime)}>
                <div className="header">
                    <div className="date">{moment(arraysItem[0].startDatetime).format('DD.MM.YYYY')}</div>
                    <div className="allTime">Total time: {this.getSumTime(arraysItem)}</div>
                </div>
                {this.createItems(arraysItem)}
            </div>
        ));

        return (
            <div className="wrapper_main_page">
                {checkAuthentication()}
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
                        <div className="time_container">{moment(this.state.time).format('HH:mm:ss')}</div>
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
                                            placeholder="Finde..."
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
                                        {this.state.arrProjectsToModal.map(item => (
                                            <div
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
        client.request(getProjectsV2).then(data => {
            this.setState({ arrProjects: data.projectV2 });
            this.setState({ arrProjectsToModal: data.projectV2 });
            this.setState({ arrProjectsEtalon: data.projectV2 });
        });
    }

    getTimeForMainPage() {
        client.request(getTodayTimeEntries(getUserId())).then(data => {
            this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: data.timerV2 });
        });
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
