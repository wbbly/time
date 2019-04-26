import React, { Component } from 'react';
import { DateFormatInput, TimeFormatInput } from 'material-ui-next-pickers';
import * as moment from 'moment';

import './style.css';
import { getTodayTimeEntriesParseFunction } from '../../queries';
import { getDate } from '../../services/timeService';
import { encodeTimeEntryIssue, decodeTimeEntryIssue } from '../../services/timeEntryService';
import { AppConfig } from '../../config';

class ManualTimeModal extends Component {
    state = {
        activeProject: '',
        selectProject: false,
        activeItem: '',
        startDate: '',
        startDateChanged: false,
        startTime: '',
        startTimeChanged: false,
        endDate: '',
        endDateChanged: false,
        endTime: '',
        endDateChanged: false,
    };

    getIssues() {
        let items = this.props.arrProjects.map((item, index) => (
            <div
                className="item_select_wrapper"
                onClick={e => this.setProject(item)}
                ref={div => (this.dropList = div)}
                key={'item_select_wrapper' + index}
            >
                <div className="issue_name margin_top_zero">{item.name}</div>
                <div className={`circle ${item.projectColor.name} margin_top_zero`} />
            </div>
        ));
        return items;
    }

    setProject(project) {
        this.setState({ activeProject: project });
        this.inputTaskName.value = project.name;
    }

    changeData() {
        let changedItem = {};

        const startDatetimeNew = moment(
            `${moment(this.state.startDate).format('YYYY-MM-DD')} ${moment(this.state.startTime).format('HH:mm')}`
        );
        const endDatetimeNew = moment(
            `${moment(this.state.endDate).format('YYYY-MM-DD')} ${moment(this.state.endTime).format('HH:mm')}`
        );
        if (
            this.state.startDateChanged ||
            this.state.startTimeChanged ||
            this.state.endDateChanged ||
            this.state.endTimeChanged
        ) {
            changedItem['startDatetime'] = startDatetimeNew.utc().toISOString();
            changedItem['endDatetime'] = endDatetimeNew.utc().toISOString();
        }

        if (+startDatetimeNew > +endDatetimeNew) {
            alert('Wrong Time start, please check it!');

            return;
        }

        changedItem['issue'] = encodeTimeEntryIssue((this.inputNameValue || {}).value || '');
        changedItem['projectId'] = this.state.activeProject.id;

        fetch(AppConfig.apiURL + `timer/${this.state.activeItem.id}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changedItem),
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                () => {
                    this.getNewData();
                    this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
                },
                err => err.text().then(_ => {})
            );
    }

    getNewData() {
        fetch(AppConfig.apiURL + `timer/user-list?userId=${JSON.parse(localStorage.getItem('user-object')).id}`, {
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
                    for (let i = 0; i < data.timerV2.length; i++) {
                        const timeEntry = data.timerV2[i];
                        timeEntry.issue = decodeTimeEntryIssue(timeEntry.issue);
                    }

                    this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: data.timerV2 });
                },
                err => err.text().then(errorMessage => {})
            );
    }

    toggleProjectsBar() {
        this.setState({ selectProject: !this.state.selectProject });
    }

    closeDropdown = e => {
        if (this.dropList && !this.dropList.contains(e.target)) {
            this.setState(
                {
                    selectProject: false,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdown);
                }
            );
        }
    };

    onChangeTime = time => {
        this.setState({ startTime: time, startTimeChanged: true });
    };

    onChangeDate = date => {
        this.setState({ startDate: date, startDateChanged: true });
    };

    onChangeTimeEnd = time => {
        this.setState({ endTime: time, endTimeChanged: true });
    };

    onChangeDateEnd = date => {
        this.setState({ endDate: date, endDateChanged: true });
    };

    render() {
        const { startDate, startTime, endDate, endTime } = this.state;
        return (
            <div className="manual_time_modal_wrapper">
                <div className="manual_time_modal_background">
                    <div className="manual_time_modal_container">
                        <i
                            className="create_projects_modal_header_close manual_time_modal_close"
                            onClick={e => {
                                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
                            }}
                        />
                        <div>
                            <span>Task name:</span>
                            <input
                                type="text"
                                className="issue_edit_modal"
                                ref={input => (this.inputNameValue = input)}
                            />
                        </div>
                        <div className="project_select_edit_modal">
                            <span>Project:</span>
                            <input
                                type="text"
                                readOnly
                                ref={input => (this.inputTaskName = input)}
                                onClick={e => {
                                    this.toggleProjectsBar();
                                    document.addEventListener('click', this.closeDropdown);
                                }}
                            />
                            <div className={`circle main_circle ${this.state.activeProject.projectColor.name}`} />
                            <i />
                            <div className="projects_list">{this.state.selectProject && this.getIssues()}</div>
                        </div>
                        <div className="manual_timer_modal_timepickers_container">
                            <div className="margin_12">
                                <span> Time start:</span>
                                <div className="date_time">
                                    <DateFormatInput value={startDate} onChange={this.onChangeDate} name="date-input" />
                                    <TimeFormatInput
                                        value={startTime}
                                        onChange={e => this.onChangeTime(e)}
                                        name="time-input"
                                    />
                                </div>
                            </div>
                            <div className="margin_12">
                                <span>Time end:</span>
                                <div className="date_time">
                                    <DateFormatInput
                                        value={endDate}
                                        onChange={this.onChangeDateEnd}
                                        name="date-input"
                                    />
                                    <TimeFormatInput
                                        value={endTime}
                                        onChange={this.onChangeTimeEnd}
                                        name="time-input"
                                    />
                                </div>
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
            </div>
        );
    }

    componentWillMount() {
        this.setState({ activeProject: this.props.editedItem.project });
        this.setState({ activeItem: this.props.editedItem });
    }

    componentDidMount() {
        this.inputNameValue.value = this.props.editedItem.issue;
        this.setState({ startDate: getDate(this.props.editedItem.startDatetime) });
        this.setState({ startTime: getDate(this.props.editedItem.startDatetime) });
        this.setState({ endDate: getDate(this.props.editedItem.endDatetime) });
        this.setState({ endTime: getDate(this.props.editedItem.endDatetime) });
        this.inputTaskName.value = this.props.editedItem.project.name;
    }
}

export default ManualTimeModal;
