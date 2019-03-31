import React, { Component } from 'react';
import * as moment from 'moment';

import './style.css';
import { changeTimeMutation, getTodayTimeEntries } from '../../queries';
import { client } from '../../requestSettings';

class ManualTimeModal extends Component {
    state = {
        activeProject: '',
        selectProject: false,
        activeItem: '',
    };

    checkSeconds(object) {
        if (object.timeFrom.length === 5) {
            object.timeFrom = object.timeFrom + ':00';
        }
        if (object.timeTo.length === 5) {
            object.timeTo = object.timeTo + ':00';
        }

        return object;
    }

    getIssues() {
        let items = this.props.arrProjects.map(item => (
            <div
                className="item_select_wrapper"
                onClick={e => this.setProject(item)}
                ref={div => (this.dropList = div)}
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
        let changedItem = JSON.parse(JSON.stringify(this.state.activeItem));
        let startDateArr = this.inputTimeStartValue.value.split(':');
        let endDateArr = this.inputTimeEndValue.value.split(':');

        changedItem.startDatetime = moment(changedItem.startDatetime)
            .set({
                hour: startDateArr[0],
                minute: startDateArr[1],
                second: 0,
            }).utc()
            .format();
        changedItem.endDatetime = moment(changedItem.endDatetime)
            .set({
                hour: endDateArr[0],
                minute: endDateArr[1],
                second: 0,
            }).utc()
            .format();

        changedItem.project = this.state.activeProject;
        changedItem.issue = this.inputNameValue.value;

        client
            .request(
                changeTimeMutation({
                    id: changedItem.id,
                    issue: changedItem.issue,
                    projectId: changedItem.project.id,
                    startDatetime: changedItem.startDatetime,
                    endDatetime: changedItem.endDatetime,
                })
            )
            .then(data => {
                this.getNewData();
                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
            });
    }

    getNewData() {
        client.request(getTodayTimeEntries(JSON.parse(localStorage.getItem('userObject')).id)).then(data => {
            this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: data.timerV2 });
        });
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
                    <div className=" project_select_edit_modal">
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
                        <div>
                            <span> Time start:</span>
                            <input type="time" required ref={input => (this.inputTimeStartValue = input)} />
                        </div>
                        <div>
                            <span>Time end:</span>
                            <input type="time" required ref={input => (this.inputTimeEndValue = input)} />
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

    componentWillMount() {
        this.setState({ activeProject: this.props.editedItem.project });
        this.setState({ activeItem: this.props.editedItem });
    }

    componentDidMount() {
        this.inputNameValue.value = this.props.editedItem.issue;

        this.inputTimeStartValue.value = moment(this.props.editedItem.startDatetime).format('HH:mm');
        this.inputTimeEndValue.value = moment(this.props.editedItem.endDatetime).format('HH:mm');
        this.inputTaskName.value = this.props.editedItem.project.name;
    }
}

export default ManualTimeModal;
