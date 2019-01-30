import React, {Component} from 'react';
import './index.css';
import LeftBar from '../../components/LeftBar';
import MainPageHistory from '../../components/MainPageHistory';
import * as moment from 'moment';

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
            this.setState(state => ({
                    arrTasks: arr
                })
            );
            this.cleanMainField();
        }
    };

    cleanMainField() {
        this.state.time = moment().set({'hour': 0, 'minute': 0, 'second': 0}).format('YYYY-MM-DD HH:mm:ss');
        this.time.timeFinish = '';
        this.time.timeStart = '';
        this.mainTaskName = '';
    }

    render() {
        const {classToggle} = this.state;
        const buttonState = classToggle ? 'play' : 'stop';
        const buttonClassName = ['control_task_time_icons', buttonState].join(' ');
        let items = this.state.arrTasks.map((item) => <MainPageHistory items={item} key={item.id}/>);

        return (
            <div className="wrapper_main_page">
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
}

export default MainPage;
