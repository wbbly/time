import React, { Component } from 'react';
import './style.css';
import LeftBar from '../../components/LeftBar';
import * as moment from 'moment';
import { connect } from 'react-redux';
import addTasks from '../../actions/MainPageAction';
import manualTimerModalAction from '../../actions/ManualTimerModalAction';
import ManualTimeModal from '../../components/Manual-time-modal';

class MainPage extends Component {
    state = {
        classToggle: true,
        intervalId: '',
        time: moment().set({'hour': 0, 'minute': 0, 'second': 0}).format('YYYY-MM-DD HH:mm:ss'),
        date: moment().format('YYYY-MM-DD'),
        arrTasks: [],
    };
    time = {
        timeStart: '',
        timeFinish: '',
    };


    changeClass = () => {
        this.setState(state => ({
            classToggle: !state.classToggle
        }));
        this.startTimer()
    };

    startTimer = () => {
        if (this.state.classToggle) {
            this.time.timeStart = moment().format('HH:mm:ss');
            this.state.intervalId = setInterval(() => {
                this.setState(state => ({
                    time: moment(state.time).add(1, 'second')
                }));
            }, 1000)
        } else {
            let arr = this.state.arrTasks;
            clearInterval(this.state.intervalId);
            this.time.timeFinish = moment().format('HH:mm:ss');
            arr.push({
                id: +new Date(),
                name: this.mainTaskName.value,
                date: this.state.date,
                timeFrom: this.time.timeStart,
                timeTo: this.time.timeFinish,
                timePassed: moment(this.state.time).format('HH:mm:ss'),
                project: 'any'
            });
            this.props.addTasksAction('ADD_TASKS_ARR', {arrTasks: arr});
            this.cleanMainField();
        }
    };

    cleanMainField() {
        this.state.time = moment().set({'hour': 0, 'minute': 0, 'second': 0}).format('YYYY-MM-DD HH:mm:ss');
        this.time.timeFinish = '';
        this.time.timeStart = '';
        this.mainTaskName = '';
    }

    deleteFromArr(item) {
        let arrFromStoreString = JSON.stringify(this.props.arrTasks);
        let arrFromStore = this.props.arrTasks;
        let deleteElement = arrFromStoreString.indexOf(JSON.stringify(item));
        arrFromStore.splice((deleteElement - 1), 1);
        this.props.addTasksAction('ADD_TASKS_ARR', {arrTasks: arrFromStore});
        this.setState({arrTasks: this.props.arrTasks});
    }

    componentWillMount() {
        this.setState({arrTasks: this.props.arrTasks})
    }

    render() {
        const {classToggle} = this.state;
        const buttonState = classToggle ? 'play' : 'stop';
        const buttonClassName = ['control_task_time_icons', buttonState].join(' ');
        let items = this.state.arrTasks.map((item) =>
            <div className="ul">
                <div className="li" key={item.id}>
                    <div className="name_container">
                        <div className="name">
                            {item.name}
                        </div>
                        <div className="project_name">
                            {item.project}
                        </div>
                    </div>
                    <div className="time_container_history">
                        <div className="time_now">
                            <div>{item.timeFrom}</div>
                            -
                            <div>{item.timeTo}</div>
                        </div>
                        <div className="timePassed">
                            {item.timePassed}
                        </div>
                        <i className="small_play"></i>
                        <i className="edit_button"
                           onClick={(e) => {
                               this.props.manualTimerModalAction('TOGGLE_MODAL', {manualTimerModalToggle: true})
                           }}>
                        </i>
                        <i className="cancel" onClick={e => this.deleteFromArr(item)}></i>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="wrapper_main_page">
                {this.props.manualTimerModal.manualTimerModalToggle &&
                <ManualTimeModal manualTimerModalAction={this.props.manualTimerModalAction}/>}
                <LeftBar/>
                <div className="data_container">
                    <div className="add_task_container">
                        <input
                            type="text"
                            className="add_task"
                            placeholder="Add your task name"
                            ref={(input) => {
                                this.mainTaskName = input
                            }}
                        />
                        <div className="time_container">
                            {moment(this.state.time).format('HH:mm:ss')}
                        </div>
                        <i className="folder"></i>
                        <i onClick={this.changeClass} className={buttonClassName}/>
                    </div>
                    {items}
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        this.props.addTasksAction('ADD_TASKS_ARR', {arrTasks: this.state.arrTasks});
    }
}

const mapStateToProps = store => {
    return {
        arrTasks: store.mainPageReducer.arrTasks,
        manualTimerModal: store.manualTimerModalReducer,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addTasksAction: (actionType, action) => dispatch(addTasks(actionType, action))[1],
        manualTimerModalAction: (actionType, action) => dispatch(manualTimerModalAction(actionType, action))[1]
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage)
