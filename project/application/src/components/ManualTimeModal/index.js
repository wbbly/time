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
import { Trans } from 'react-i18next';

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
            alert(`Please input task name before saving the time tracking`);
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
        const { viewport, manualTimerModalAction } = this.props;

        return (
            <div className={viewport.width >= 1024 ? 'manual_time_modal_wrapper' : 'manual_time_modal_wrapper--mobile'}>
                <div className="manual_time_modal_background">
                    <div className="manual_time_modal_container">
                        <i
                            className="create_projects_modal_header_close manual_time_modal_close"
                            onClick={e => {
                                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
                            }}
                        />
                        <div className="task_name_edit_block">
                            <span>
                                <Trans i18nKey="task_name"> Task name</Trans> :
                            </span>
                            <input
                                type="text"
                                className="issue_edit_modal"
                                ref={input => (this.inputNameValue = input)}
                            />
                        </div>
                        <div className="project_select_edit_modal">
                            <span>
                                <Trans i18nKey="project">Project</Trans>:
                            </span>
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
                                <span>
                                    <Trans i18nKey="time_start">Time start</Trans>:
                                </span>
                                <div className="date_time">
                                    {viewport.width >= 1024 && <i className="calendar" />}
                                    <i className="clock" />
                                    {viewport.width >= 1024 ? (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                            <Grid container justify="space-between">
                                                <DatePicker
                                                    value={startDate}
                                                    onChange={this.onChangeDate}
                                                    format={'dd.MM.yyyy'}
                                                />

                                                <TimePicker value={startTime} onChange={this.onChangeTime} />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    ) : (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                            <TimePicker value={startTime} onChange={this.onChangeTime} />
                                        </MuiPickersUtilsProvider>
                                    )}
                                </div>
                            </div>
                            <div className="margin_12">
                                <span>
                                    <Trans i18nKey="time_end">Time end</Trans>:
                                </span>
                                <div className="date_time">
                                    {viewport.width >= 1024 && <i className="calendar" />}
                                    <i className="clock" />
                                    {viewport.width >= 1024 ? (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                            <Grid container justify="space-between">
                                                <DatePicker
                                                    value={endDate}
                                                    onChange={this.onChangeDateEnd}
                                                    format={'dd.MM.yyyy'}
                                                />

                                                <TimePicker value={endTime} onChange={this.onChangeTimeEnd} />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    ) : (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                            <TimePicker value={endTime} onChange={this.onChangeTimeEnd} />
                                        </MuiPickersUtilsProvider>
                                    )}
                                </div>
                            </div>
                        </div>
                        {this.props.viewport.width < 1024 ? (
                            !this.state.selectProject && (
                                <div className="manual_timer_modal_button_container">
                                    <button
                                        className="create_projects_modal_button_container_button manual_time_button"
                                        onClick={e => this.changeData()}
                                    >
                                        <Trans i18nKey="change">Change</Trans>
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="manual_timer_modal_button_container">
                                <button
                                    className="create_projects_modal_button_container_button manual_time_button"
                                    onClick={e => this.changeData()}
                                >
                                    <Trans i18nKey="change">Change</Trans>
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
});

export default connect(mapStateToProps)(ManualTimeModal);
