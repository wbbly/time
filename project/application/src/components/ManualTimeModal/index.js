import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import locale from 'date-fns/locale/en-GB';
import * as moment from 'moment';

// Services
import { getDate } from '../../services/timeService';
import { encodeTimeEntryIssue } from '../../services/timeEntryService';
import { apiCall } from '../../services/apiService';

// Components

// Actions

// Queries
import { getTodayTimeEntriesParseFunction } from '../../queries';

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class ManualTimeModal extends Component {
    state = {
        activeProject: null,
        selectProject: false,
        activeItem: null,
        startDate: null,
        startDateChanged: false,
        startTime: null,
        startTimeChanged: false,
        endDate: null,
        endDateChanged: false,
        endTime: null,
    };

    getIssues() {
        let items = this.props.projectList.map((item, index) => (
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
        const { vocabulary } = this.props;
        const { v_a_time_start_error, v_a_task_name_error } = vocabulary;
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
            alert(v_a_time_start_error);
            return false;
        }

        changedItem['issue'] = encodeTimeEntryIssue(((this.inputNameValue || {}).value || '').trim());
        if (changedItem['issue'].length) {
            changedItem['projectId'] = this.state.activeProject.id;

            apiCall(AppConfig.apiURL + `timer/${this.state.activeItem.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changedItem),
            }).then(
                () => {
                    this.getNewData();
                    this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => console.log(errorMessage));
                    } else {
                        console.log(err);
                    }
                }
            );
        } else {
            alert(v_a_task_name_error);
        }
    }

    getNewData() {
        apiCall(AppConfig.apiURL + `timer/user-list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                let data = getTodayTimeEntriesParseFunction(result.data);
                this.props.addTasksAction('ADD_TASKS_ARR', { timeEntriesList: data.timerV2 });
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
        const { vocabulary, isMobile, manualTimerModalAction } = this.props;
        const { v_task_name, v_project, v_time_start, v_time_end, v_change, lang } = vocabulary;

        return (
            <div className={!isMobile ? 'manual_time_modal_wrapper' : 'manual_time_modal_wrapper--mobile'}>
                <div className="manual_time_modal_background">
                    <div className="manual_time_modal_container">
                        <i
                            className="create_projects_modal_header_close manual_time_modal_close"
                            onClick={e => {
                                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
                            }}
                        />
                        <div className="task_name_edit_block">
                            <span>{v_task_name}:</span>
                            <input
                                type="text"
                                className="issue_edit_modal"
                                ref={input => (this.inputNameValue = input)}
                            />
                        </div>
                        <div className="project_select_edit_modal">
                            <span>{v_project}:</span>
                            <div className="wrapper-input-block-mobile">
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
                                <i className="arrow_list_mobile" />
                            </div>
                            {this.state.selectProject && (
                                <div className="projects_list">{this.state.selectProject && this.getIssues()}</div>
                            )}
                        </div>
                        <div className="manual_timer_modal_timepickers_container">
                            <div className="margin_12">
                                <span> {v_time_start}:</span>
                                <div className="date_time">
                                    {!isMobile && <i className="calendar" />}
                                    <i className="clock" />
                                    {!isMobile ? (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                            <Grid container justify="space-between">
                                                <DatePicker
                                                    value={startDate}
                                                    onChange={this.onChangeDate}
                                                    format={'dd.MM.yyyy'}
                                                />

                                                <TimePicker
                                                    value={startTime}
                                                    onChange={this.onChangeTime}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    ) : (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                            <TimePicker
                                                value={startTime}
                                                onChange={this.onChangeTime}
                                            />
                                        </MuiPickersUtilsProvider>
                                    )}
                                </div>
                            </div>
                            <div className="margin_12">
                                <span>{v_time_end}:</span>
                                <div className="date_time">
                                    {!isMobile && <i className="calendar" />}
                                    <i className="clock" />
                                    {!isMobile ? (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                            <Grid container justify="space-between">
                                                <DatePicker
                                                    value={endDate}
                                                    onChange={this.onChangeDateEnd}
                                                    format={'dd.MM.yyyy'}
                                                />

                                                <TimePicker
                                                    value={endTime}
                                                    onChange={this.onChangeTimeEnd}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    ) : (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                            <TimePicker
                                                value={endTime}
                                                onChange={this.onChangeTimeEnd}
                                            />
                                        </MuiPickersUtilsProvider>
                                    )}
                                </div>
                            </div>
                        </div>
                        {isMobile ? (
                            !this.state.selectProject && (
                                <div className="manual_timer_modal_button_container">
                                    <button
                                        className="create_projects_modal_button_container_button manual_time_button"
                                        onClick={e => this.changeData()}
                                    >
                                        {v_change}
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="manual_timer_modal_button_container">
                                <button
                                    className="create_projects_modal_button_container_button manual_time_button"
                                    onClick={e => this.changeData()}
                                >
                                    {v_change}
                                </button>
                            </div>
                        )}
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

const mapStateToProps = store => ({
    viewport: store.responsiveReducer.viewport,
    vocabulary: store.languageReducer.vocabulary,
    isMobile: store.responsiveReducer.isMobile,
});

export default connect(mapStateToProps)(ManualTimeModal);
