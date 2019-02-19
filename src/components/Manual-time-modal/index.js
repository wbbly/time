import React, { Component } from 'react';
import * as moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import { returnMutationUpdateTimerProject } from '../../queries';
import { client } from '../../requestSettings';

class ManualTimeModal extends Component {
    componentDidMount() {
        this.inputNameValue.value = this.props.editedItem.name;
        this.inputTimeStartValue.value = this.props.editedItem.timeFrom;
        this.inputTimeEndValue.value = this.props.editedItem.timeTo;
    }

    changeData() {
        let index = this.props.arrTasks.findIndex(x => x.id === this.props.editedItem.id);
        let object = {
            id: this.props.arrTasks[index].id,
            date: this.props.editedItem.date,
            project: this.props.editedItem.project,
            name: this.inputNameValue.value,
            timeFrom: this.inputTimeStartValue.value,
            timeTo: this.inputTimeEndValue.value,
        };

        object.timePassed = createTimePassed(object.date, object.timeFrom, object.timeTo);
        this.props.arrTasks[index] = object;
        client.request(returnMutationUpdateTimerProject(object)).then(data => {});

        function createTimePassed(date, timeFrom, timeTo) {
            timeFrom = moment(`${date} ${timeFrom}`);
            timeTo = moment(`${date} ${timeTo}`);
            let diff = timeTo.diff(timeFrom);
            return msToTime(diff);
        }

        function msToTime(duration) {
            let seconds = parseInt((duration / 1000) % 60),
                minutes = parseInt((duration / (1000 * 60)) % 60),
                hours = parseInt((duration / (1000 * 60 * 60)) % 24);

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            return hours + ':' + minutes + ':' + seconds;
        }
        this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
    }

    render() {
        return (
            <div className="manual_time_modal_wrapper">
                <div className="manual_time_modal_background" />
                <div className="manual_time_modal_container">
                    <i
                        className="create_projects_modal_header_close manual_time_modal_close"
                        onClick={e => {
                            this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
                        }}
                    />
                    <div>
                        <span>Task name:</span>
                        <input type="text" ref={input => (this.inputNameValue = input)} />
                    </div>
                    <div className="manual_timer_modal_timepickers_container">
                        <div>
                            <span> Time start:</span>
                            <input type="time" ref={input => (this.inputTimeStartValue = input)} />
                        </div>
                        <div>
                            <span>Time end:</span>
                            <input type="time" ref={input => (this.inputTimeEndValue = input)} />
                        </div>
                    </div>
                    <div className="manual_timer_modal_button_container">
                        <button
                            className="create_projects_modal_button_container_button manual_time_button"
                            onClick={e => this.changeData()}
                        >
                            Change
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManualTimeModal;
