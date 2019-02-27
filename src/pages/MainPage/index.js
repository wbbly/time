import React, { Component } from 'react';
import { connect } from 'react-redux';
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

class MainPage extends Component {
    state = {
        classToggle: true,
        intervalId: '',
        time: moment()
            .set({ hour: 0, minute: 0, second: 0 })
            .format('YYYY-MM-DD HH:mm:ss'),
        date: moment().format('YYYY-MM-DD'),
        seletedProject: 'any',
        timerStartDateTime: '',
        arrTasks: [],
        arrProjects: [],
        projectListOpen: false,
    };
    time = {
        timeStart: '',
        timeFinish: '',
    };

    projectListeToggle = () => {
        this.setState({ projectListOpen: !this.state.projectListOpen });
    };

    changeClass = () => {
        this.setState(state => ({
            classToggle: !state.classToggle,
        }));
        this.startTimer();
    };

    startTimer = () => {
        if (this.state.classToggle) {
            this.setState({ timerStartDateTime: +moment() });
            this.time.timeStart = +moment();
            this.state.intervalId = setInterval(() => {
                this.setState(state => ({
                    time: moment(state.time).add(1, 'second'),
                }));
            }, 1000);
        } else {
            let arr = this.props.arrTasks;
            localStorage.removeItem('LT');
            clearInterval(this.state.intervalId);
            this.time.timeFinish = moment().format('HH:mm:ss');
            let object = {
                id: +new Date(),
                name: this.mainTaskName.value,
                date: this.state.date,
                timeFrom: getDateInString(this.time.timeStart),
                timeTo: this.time.timeFinish,
                timePassed: moment(this.state.time).format('HH:mm:ss'),
                userId: 1,
                project: this.state.seletedProject,
                email: atob(localStorage.getItem('active_email')),
            };
            arr.unshift(object);
            client.request(returnMutationLinkAddTimeEntries(object)).then(data => {});
            this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: arr });
            this.cleanMainField();
        }
    };

    saveTimer() {
        localStorage.setItem(
            'LT',
            JSON.stringify({
                taskName: this.mainTaskName.value,
                timeStart: this.time.timeStart,
                timerStartDateTime: this.state.timerStartDateTime,
                seletedProject: this.state.seletedProject,
            })
        );
    }

    cleanMainField() {
        this.state.time = moment()
            .set({ hour: 0, minute: 0, second: 0 })
            .format('YYYY-MM-DD HH:mm:ss');
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

    startOldTask(oldTask) {
        this.mainTaskName.value = oldTask.name;
        this.setState({ selectedProject: oldTask.project });
        this.changeClass();
    }

    getTimeNow() {
        let timer = JSON.parse(localStorage.getItem('LT'));
        if (!timer || !timer.timeStart) {
            return;
        }
        let newTime = +moment() - timer.timeStart;
        let timeInArr = getDateInString(newTime).split(':');
        this.setState({ time: getDateInString(newTime) });
        this.setState({
            time: moment()
                .set({ hour: timeInArr[0], minute: timeInArr[1], second: timeInArr[2] })
                .format('YYYY-MM-DD HH:mm:ss'),
        });
        this.changeClass();
    }

    setOldTaskName() {
        let timer = JSON.parse(localStorage.getItem('LT'));
        if (!timer) {
            return;
        }
        this.mainTaskName.value = timer.taskName;
        this.setState({ seletedProject: timer.seletedProject });
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
        this.getTimeNow();
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
                            <div>{item.timeFrom}</div>-<div>{item.timeTo}</div>
                        </div>
                        <div className="timePassed">{item.timePassed}</div>
                        <i
                            className="small_play"
                            onClick={e => {
                                this.startOldTask(item);
                                this.saveTimer();
                            }}
                        />
                        <i
                            className="edit_button"
                            onClick={e => {
                                this.props.addTasksAction('SET_EDITED_ITEM', { editedItem: item });
                                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: true });
                            }}
                        />
                        <i className="cancel" onClick={e => this.deleteFromArr(item)} />
                    </div>
                </div>
            </div>
        ));
        return items;
    }

    getDay(arr) {
        return arr[0].date;
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
    }

    handleOutsideClick(e) {
        // ignore clicks on the component itself
        if (this.node.contains(e.target)) {
            return;
        } else {
            alert('');
        }

        this.setState({ projectListOpen: !this.state.projectListOpen });
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
                        />
                        <div className="time_container">{moment(this.state.time).format('HH:mm:ss')}</div>
                        <div>{this.getProject(this.state.seletedProject)}</div>
                        <i className="folder" onClick={e => this.projectListeToggle()}>
                            {this.state.projectListOpen && (
                                <div
                                    className="projects_modal_wrapper"
                                    ref={node => {
                                        this.node = node;
                                    }}
                                    onClick={e => this.handleOutsideClick(e)}
                                >
                                    <div
                                        className="projects_modal_wrapper_header"
                                        onClick={event => {
                                            event.stopPropagation();
                                        }}
                                    >
                                        <input
                                            placeholder="Finde..."
                                            type="text"
                                            className="projects_modal_wrapper_search"
                                        />
                                    </div>
                                    <div className="projects_modal_data_wrapper">
                                        {this.state.arrProjects.map(item => (
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
                                this.changeClass();
                                this.saveTimer();
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
        this.setOldTaskName();
        client
            .request(getTodayTimeEntries(atob(localStorage.getItem('active_email'))))
            .then(data => this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: data.timeTracker }));
        client.request(getProjects).then(data => {
            this.setState({ arrProjects: data.project });
        });
    }

    componentWillUnmount() {}
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
