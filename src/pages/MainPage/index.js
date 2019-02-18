import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import './style.css';
import LeftBar from '../../components/LeftBar';
import addTasks from '../../actions/MainPageAction';
import manualTimerModalAction from '../../actions/ManualTimerModalAction';
import ManualTimeModal from '../../components/Manual-time-modal';
import { client } from '../../requestSettings';
import { createArayOfArrays } from './createArrayOfArraysFunction';
import {
    getTodayTimeEntries,
    returnMutationLinkAddTimeEntries,
    returnMutationLinkDeleteTimeEntries,
} from '../../queries';

class MainPage extends Component {
    state = {
        classToggle: true,
        intervalId: '',
        time: moment()
            .set({ hour: 0, minute: 0, second: 0 })
            .format('YYYY-MM-DD HH:mm:ss'),
        date: moment().format('YYYY-MM-DD'),
        timerStartDateTime: '',
        arrTasks: [],
    };
    time = {
        timeStart: '',
        timeFinish: '',
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
            this.time.timeStart = moment().format('HH:mm:ss');
            this.state.intervalId = setInterval(() => {
                this.setState(state => ({
                    time: moment(state.time).add(1, 'second'),
                }));
            }, 1000);
        } else {
            let arr = this.props.arrTasks;
            clearInterval(this.state.intervalId);
            this.time.timeFinish = moment().format('HH:mm:ss');
            let object = {
                id: +new Date(),
                name: this.mainTaskName.value,
                date: this.state.date,
                timeFrom: this.time.timeStart,
                timeTo: this.time.timeFinish,
                timePassed: moment(this.state.time).format('HH:mm:ss'),
                userId: 1,
                project: 'any',
            };
            arr.unshift(object);
            client.request(returnMutationLinkAddTimeEntries(object)).then(data => {});
            this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: arr });
            this.cleanMainField();
        }
    };

    saveTimer() {
        console.log(this.state.classToggle);
        if (!this.state.classToggle) {
            localStorage.removeItem('LT');
            localStorage.setItem(
                'LT',
                JSON.stringify({
                    taskName: this.mainTaskName.value,
                    timeStampClosePage: moment().format('YYYY-MM-DD HH:mm:ss'),
                    timeOnTimer: this.state.time.format('YYYY-MM-DD HH:mm:ss'),
                    timerStartDateTime: this.state.timerStartDateTime,
                })
            );
        } else {
            localStorage.removeItem('LT');
        }
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
        this.changeClass();
    }

    getTimeNow() {
        let timer = JSON.parse(localStorage.getItem('LT'));
        if (!timer) {
            return;
        }
        let timeStampClosePage = moment(timer.timeStampClosePage);
        let timeOnTimer = timer.timeOnTimer;
        let newTime = moment(timeOnTimer)
            .add(moment(moment().diff(timeStampClosePage)).format('s'), 'seconds')
            .format('HH:mm:ss')
            .split(':');
        this.setState({
            time: moment()
                .set({ hour: newTime[0], minute: newTime[1], second: newTime[2] })
                .format('YYYY-MM-DD HH:mm:ss'),
        });
        this.changeClass();
        localStorage.removeItem('LT');
    }

    setOldTaskName() {
        let timer = JSON.parse(localStorage.getItem('LT'));
        if (!timer) {
            return;
        }
        this.mainTaskName.value = timer.taskName;
    }

    componentWillMount() {
        this.getTimeNow();
    }

    createItems(arr) {
        let items = arr.map(item => (
            <div className="ul" key={item.id}>
                <div className="li">
                    <div className="name_container">
                        <div className="name">{item.name}</div>
                        <div className="project_name">{item.project}</div>
                    </div>
                    <div className="time_container_history">
                        <div className="time_now">
                            <div>{item.timeFrom}</div>-<div>{item.timeTo}</div>
                        </div>
                        <div className="timePassed">{item.timePassed}</div>
                        <i className="small_play" onClick={e => this.startOldTask(item)} />
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
                        <i className="folder" />
                        <i onClick={this.changeClass} className={buttonClassName} />
                    </div>
                    {timeTrackerWrapperItems}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.setOldTaskName();
        client
            .request(getTodayTimeEntries)
            .then(data => this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: data.timeTracker }));
    }

    componentWillUnmount() {
        this.saveTimer();
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
