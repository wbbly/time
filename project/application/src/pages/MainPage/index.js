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
import {
    getProjects,
    getTodayTimeEntries,
    returnMutationLinkAddTimeEntries,
    returnMutationLinkDeleteTimeEntries,
} from '../../queries';
import { checkAuthentication } from '../../services/authentication';
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
        seletedProject: 52,
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
                'join',
                {
                    userEmail: atob(localStorage.getItem('active_email')),
                },
                _ => {
                    this.socket.emit('check-timer', {
                        userEmail: atob(localStorage.getItem('active_email')),
                    });
                }
            );
        });
        this.socket.on('check-timer', data => {
            if (this.startTimerInitiator) {
                this.startTimerInitiator = false;
            }

            if (data) {
                localStorage.setItem(
                    'current-timer',
                    JSON.stringify({
                        taskName: data.issue,
                        timeStart: +moment(data.dateFrom),
                        seletedProject: data.project.id,
                    })
                );
                this.getTimeNow(
                    {
                        taskName: data.issue,
                        timeStart: +moment(data.dateFrom),
                        seletedProject: data.project.id,
                    },
                    data
                );
            }
        });
        this.socket.on('stop-timer', data => {
            clearInterval(this.TIMER_LIVE_SUBSCRIPTION);
            this.TIMER_LIVE_SUBSCRIPTION = undefined;
            const timeEntry = this.getTimeEntry(data);
            this.timerStop(timeEntry);
            if (this.stopTimerInitiator) {
                this.saveTimeEntry(timeEntry);
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

    saveStartTimer(className) {
        if (className === 'control_task_time_icons play') {
            this.startTimerInitiator = true;
            this.socket.emit('start-timer', {
                userEmail: atob(localStorage.getItem('active_email')),
                issue: this.mainTaskName.value,
                projectId: this.state.seletedProject,
            });
        } else {
            this.stopTimerInitiator = true;
            this.socket.emit('stop-timer', {
                userEmail: atob(localStorage.getItem('active_email')),
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
                    userEmail: atob(localStorage.getItem('active_email')),
                    issue: this.mainTaskName.value,
                    projectId: this.state.seletedProject,
                });
            }
        }, 300);
    }

    timerStop(timeEntry) {
        let timeEntries = this.props.arrTasks;
        timeEntries.unshift(timeEntry);
        this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: timeEntries });

        localStorage.removeItem('current-timer');
        this.cleanMainField();
        this.setState(state => ({
            classToggle: !state.classToggle,
        }));
    }

    getTimeEntry(data) {
        const { issue, dateFrom, dateTo, project, userEmail } = data;

        this.time.timeFinish = moment(dateTo).format('HH:mm:ss');
        const timeEntry = {
            id: +new Date(),
            name: issue,
            date: moment(dateFrom).format('YYYY-MM-DD'),
            timeFrom: moment(dateFrom).format('HH:mm:ss'),
            timeTo: moment(dateTo).format('HH:mm:ss'),
            timePassed: getDateInString(+moment(dateTo) - +moment(dateFrom)),
            project: project.id,
            email: userEmail,
        };

        return timeEntry;
    }

    saveTimeEntry(timeEntry) {
        client.request(returnMutationLinkAddTimeEntries(timeEntry)).then(_ => {});
    }

    cleanMainField() {
        this.setState({
            time: moment()
                .set({ hour: 0, minute: 0, second: 0 })
                .format('YYYY-MM-DD HH:mm:ss'),
        });
        this.time.timeFinish = '';
        this.time.timeStart = '';
        this.mainTaskName.value = '';
    }

    deleteFromArr(item) {
        let newArr = [];
        for (let i = 0; i < this.props.arrTasks.length; i++) {
            if (this.props.arrTasks[i].id !== item.id) {
                newArr.push(this.props.arrTasks[i]);
            }
        }
        client
            .request(returnMutationLinkDeleteTimeEntries(item))
            .then(data => this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: newArr }));
    }

    checkZero(timeInString) {
        if (timeInString.length === 2) {
            return timeInString + ':00';
        } else {
            return timeInString;
        }
    }

    getTimeNow(object, data) {
        let timer = object;
        if (!timer || !timer.timeStart) {
            return;
        }
        this.time.timeStart = timer.timeStart;
        let newTime = +moment() - timer.timeStart;
        let timeInArr = getDateInString(newTime).split(':');
        this.setState({
            time: moment()
                .set({ hour: timeInArr[0], minute: timeInArr[1], second: timeInArr[2] })
                .format('YYYY-MM-DD HH:mm:ss'),
        });
        this.timerStart();
        this.setState(state => ({
            classToggle: !state.classToggle,
        }));
        this.setOldTaskName(data);
    }

    setOldTaskName(data) {
        if (!data) {
            return;
        }
        this.mainTaskName.value = data.issue;
        this.setState({ seletedProject: data.project.id });
    }

    findProject = (projectId, key) => {
        if (projectId === 'any') {
            return 'any';
        }

        for (let i = 0; i < this.state.arrProjects.length; i++) {
            if (this.state.arrProjects[i].id === +projectId) {
                if (key === 'name') {
                    return this.state.arrProjects[i].name;
                } else if (key === 'color') {
                    return this.state.arrProjects[i].colorProject;
                }
            }
        }
    };

    componentWillMount() {
        this.initSocketConnection();
    }

    createItems(arr) {
        let items = arr.map(item => (
            <div className="ul" key={item.id}>
                <div className="li">
                    <div className="name_container">
                        <div className="name">{item.name}</div>
                        <div className="project_name">
                            <span className={`circle ${this.findProject(item.project, 'color')}`} />
                            <span>{this.findProject(item.project, 'name')}</span>
                        </div>
                    </div>
                    <div className="time_container_history">
                        <div className="time_now">
                            <div>{this.checkZero(item.timeFrom.slice(0, -3))}</div>-{' '}
                            <div>{this.checkZero(item.timeTo.slice(0, -3))}</div>
                        </div>
                        <div className="timePassed">{item.timePassed}</div>
                        {moment(this.state.time).format('HH:mm:ss') === '00:00:00' && (
                            <i
                                className="small_play item_button"
                                onClick={e => {
                                    this.saveOldTask(item.name, item.project);
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

    saveOldTask(name, project) {
        this.mainTaskName.value = name;
        this.setState({ seletedProject: +project });
        this.saveStartTimer('control_task_time_icons play');
    }

    getDate(date) {
        if (date === moment().format('YYYY-MM-DD')) {
            return 'Today';
        } else {
            return date
                .split('-')
                .reverse()
                .join('.');
        }
    }

    getSumTime(arr) {
        let sumTime = 0;
        for (let i = 0; i < arr.length; i++) {
            let hms = arr[i].timePassed;
            let a = hms.split(':');
            let seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
            sumTime += seconds;
        }
        let date = new Date(null);
        date.setSeconds(sumTime);
        let result = date.toISOString().substr(11, 8);

        return result;
    }

    setActiveProject(item) {
        this.setState({ seletedProject: item.id });
        this.timerUpdate();
    }

    getProject(id) {
        for (let i = 0; i < this.state.arrProjects.length; i++) {
            if (this.state.arrProjects[i].id === id) {
                return (
                    <div className="active_project">
                        <span className={`projects_modal_item_circle ${this.state.arrProjects[i].colorProject}`} />
                        <span className="projects_modal_item_name">{this.state.arrProjects[i].name}</span>
                    </div>
                );
            }
        }
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
            <div className="time_tracker_wrapper">
                <div className="header">
                    <div className="date">{this.getDate(arraysItem[0].date)}</div>
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
                                                <div className={`projects_modal_item_circle ${item.colorProject}`} />
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
        client
            .request(getTodayTimeEntries(atob(localStorage.getItem('active_email'))))
            .then(data => this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: data.timeTracker }));
        client.request(getProjects).then(data => {
            this.setState({ arrProjects: data.project });
            this.setState({ arrProjectsToModal: data.project });
            this.setState({ arrProjectsEtalon: data.project });
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
