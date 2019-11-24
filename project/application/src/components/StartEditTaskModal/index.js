import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

// API
import { changeTask } from '../../configAPI';
import { startTimerSocket } from '../../configSocket';

// Services
import { encodeTimeEntryIssue } from '../../services/timeEntryService';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';
import { getTimeEntriesListAction } from '../../actions/MainPageAction';

// Components
import { Loading } from '../Loading';

// TimePicker
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import enLocale from 'date-fns/locale/en-GB';

// Styles
import './style.scss';

const CloseIcon = ({ className, onClick }) => (
    <svg className={className} onClick={onClick} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18.5023 0.132198C18.326 -0.0440659 18.0375 -0.0440659 17.8612 0.132198L11.3205 6.67289C11.1443 6.84916 10.8557 6.84916 10.6795 6.67289L4.13891 0.132198C3.96265 -0.0440659 3.67414 -0.0440659 3.49787 0.132198L0.132198 3.49775C-0.0440659 3.67401 -0.0440659 3.96252 0.132198 4.13879L6.67289 10.6795C6.84916 10.8557 6.84916 11.1443 6.67289 11.3205L0.132198 17.8612C-0.0440659 18.0375 -0.0440659 18.326 0.132198 18.5023L3.49775 21.8678C3.67401 22.0441 3.96252 22.0441 4.13879 21.8678L10.6795 15.3271C10.8557 15.1508 11.1443 15.1508 11.3205 15.3271L17.8611 21.8677C18.0374 22.0439 18.3259 22.0439 18.5021 21.8677L21.8677 18.5021C22.0439 18.3259 22.0439 18.0374 21.8677 17.8611L15.3271 11.3205C15.1508 11.1443 15.1508 10.8557 15.3271 10.6795L21.8677 4.13891C22.0439 3.96265 22.0439 3.67414 21.8677 3.49787L18.5023 0.132198Z"
            fill="#828282"
        />
    </svg>
);

const PlayIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.1891 7.72468L2.40808 0.177888C2.0598 -0.0329294 1.62733 0.002194 1.3007 0.002194C-0.00579539 0.002194 4.48246e-07 1.02775 4.48246e-07 1.28757V16.7124C4.48246e-07 16.932 -0.00571918 17.9978 1.3007 17.9978C1.62733 17.9978 2.05988 18.0328 2.40808 17.8221L14.1891 10.2753C15.1561 9.69034 14.989 8.99997 14.989 8.99997C14.989 8.99997 15.1561 8.3096 14.1891 7.72468Z"
            fill="white"
        />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
);

const muiTheme = createMuiTheme({
    overrides: {
        MuiFormHelperText: {
            root: {
                display: 'none',
            },
        },
        MuiTypography: {
            h2: {
                fontSize: '6rem',
            },
        },
        MuiButton: {
            label: {
                fontSize: '1.7rem',
            },
        },
        MuiPickersClockNumber: {
            clockNumber: {
                fontSize: '1.7rem',
            },
        },
        MuiInputBase: {
            input: {
                fontSize: '1.7rem',
            },
        },
    },
});

class StartEditTaskModal extends Component {
    state = {
        taskName: '',
        isStartingTask: false,
        selectedProject: null,
        showProjectsList: false,
        isUpdatingTask: false,
        startDateTime: null,
        endDateTime: null,
        isChanged: false,
    };

    static getDerivedStateFromProps(props, state) {
        const { timeEntriesList, editMode, task } = props;
        const { selectedProject } = state;
        if (!selectedProject) {
            if (editMode) {
                return {
                    taskName: task.issue,
                    selectedProject: task.project,
                    startDateTime: moment(task.startDatetime).toDate(),
                    endDateTime: moment(task.endDatetime).toDate(),
                };
            }
            return {
                selectedProject: timeEntriesList[0].project,
            };
        }
        return null;
    }

    handleSubmit = event => {
        event.preventDefault();
        const { vocabulary, showNotificationAction, editMode, disableShowModal } = this.props;
        const {
            v_a_task_name_before,
            v_a_starting,
            v_a_time_tracking,
            v_a_task_name_error,
            v_a_time_start_error,
        } = vocabulary;
        const { taskName, selectedProject, isChanged, startDateTime, endDateTime } = this.state;
        if (editMode) {
            if (isChanged) {
                if (!taskName) {
                    showNotificationAction({
                        text: `${v_a_task_name_error}`,
                        type: 'warning',
                    });
                    return;
                }
                if (moment(startDateTime).isValid() && moment(endDateTime).isValid()) {
                    const day = moment(startDateTime).format('YYYY-MM-DD');
                    const startTime = moment(`${day} ${moment(startDateTime).format('HH:mm')}`);
                    const endTime = moment(`${day} ${moment(endDateTime).format('HH:mm')}`);
                    if (+startTime >= +endTime) {
                        showNotificationAction({ text: v_a_time_start_error, type: 'warning' });
                        return;
                    } else {
                        this.updateTask({
                            issue: taskName,
                            projectId: selectedProject.id,
                            startDateTime: startTime,
                            endDateTime: endTime,
                        });
                    }
                } else {
                    showNotificationAction({ text: v_a_time_start_error, type: 'warning' });
                    return;
                }
            } else {
                disableShowModal();
            }
        } else {
            if (!taskName) {
                showNotificationAction({
                    text: `${v_a_task_name_before} ${v_a_starting} ${v_a_time_tracking}`,
                    type: 'warning',
                });
                return;
            }
            this.setState(
                {
                    isStartingTask: true,
                },
                () =>
                    startTimerSocket({
                        issue: taskName,
                        projectId: selectedProject.id,
                    })
            );
        }
    };

    handleChangeTaskName = event => {
        const taskName = event.target.value;
        this.setState({
            taskName,
            isChanged: true,
        });
    };

    opentProjectsList = event => {
        this.setState({
            showProjectsList: true,
        });
        document.addEventListener('click', this.closeProjectsList);
    };

    closeProjectsList = event => {
        this.setState({
            showProjectsList: false,
        });
        document.removeEventListener('click', this.closeProjectsList);
    };

    setSelectedProject = project =>
        this.setState({
            selectedProject: project,
            isChanged: true,
        });

    changeHandlerStartTime = startTime => {
        this.setState({
            startDateTime: startTime,
            isChanged: true,
        });
    };

    changeHandlerEndTime = endTime => {
        this.setState({
            endDateTime: endTime,
            isChanged: true,
        });
    };

    updateTask = async ({ issue, projectId, startDateTime, endDateTime }) => {
        this.setState({ isUpdatingTask: true });
        const { task, getTimeEntriesListAction, disableShowModal } = this.props;
        const data = {
            issue: encodeTimeEntryIssue(issue.trim()),
            projectId,
            startDatetime: startDateTime.utc().toISOString(),
            endDatetime: endDateTime.utc().toISOString(),
        };
        await changeTask(task.id, data);
        await getTimeEntriesListAction();
        disableShowModal();
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.closeProjectsList);
    }

    render() {
        const {
            taskName,
            selectedProject,
            showProjectsList,
            isStartingTask,
            isUpdatingTask,
            startDateTime,
            endDateTime,
        } = this.state;
        const { vocabulary, disableShowModal, projectsList, editMode, timeFormat } = this.props;
        const {
            v_add_your_task_name,
            v_start_timer,
            v_task_name,
            v_project,
            v_time_start,
            v_time_end,
            v_cancel,
            v_ok,
            v_change,
        } = vocabulary;

        return (
            <div className="start-edit-task-modal">
                <form onSubmit={this.handleSubmit} className="start-edit-task-modal__form">
                    <CloseIcon className="start-edit-task-modal__close-icon" onClick={disableShowModal} />
                    <div className="start-edit-task-modal__label">{`${v_task_name}:`}</div>
                    <input
                        type="text"
                        className="start-edit-task-modal__task-name-input"
                        placeholder={v_add_your_task_name}
                        value={taskName}
                        onChange={this.handleChangeTaskName}
                        onFocus={event => (event.target.placeholder = '')}
                        onBlur={event => (event.target.placeholder = v_add_your_task_name)}
                    />
                    <div className="start-edit-task-modal__label">{`${v_project}:`}</div>
                    <div className="start-edit-task-modal__projects-dropdown">
                        <div className="start-edit-task-modal__projects-selected" onClick={this.opentProjectsList}>
                            <span
                                className="start-edit-task-modal__projects-selected-circle"
                                style={{ background: selectedProject.projectColor.name }}
                            />
                            <span className="start-edit-task-modal__projects-selected-name">
                                {selectedProject.name}
                            </span>
                        </div>
                        {showProjectsList && (
                            <div className="start-edit-task-modal__projects-list">
                                {projectsList.map(project => {
                                    const { name, projectColor, id } = project;
                                    return (
                                        <div
                                            key={id}
                                            className="start-edit-task-modal__projects-list-item"
                                            onClick={event => this.setSelectedProject(project)}
                                        >
                                            <span
                                                className="start-edit-task-modal__projects-list-item-circle"
                                                style={{ background: projectColor.name }}
                                            />
                                            <span className="start-edit-task-modal__projects-list-item-name">
                                                {name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {!showProjectsList &&
                        editMode && (
                            <ThemeProvider theme={muiTheme}>
                                <div className="start-edit-task-modal_set-time">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
                                        <div className="start-edit-task-modal_set-time-start">
                                            <div className="start-edit-task-modal_set-time-label">{`${v_time_start}:`}</div>
                                            <KeyboardTimePicker
                                                cancelLabel={v_cancel}
                                                okLabel={v_ok}
                                                ampm={timeFormat === '12'}
                                                value={startDateTime}
                                                onChange={this.changeHandlerStartTime}
                                                keyboardIcon={<ClockIcon />}
                                            />
                                        </div>
                                        <div className="start-edit-task-modal_set-time-end">
                                            <div className="start-edit-task-modal_set-time-label">{`${v_time_end}:`}</div>
                                            <KeyboardTimePicker
                                                cancelLabel={v_cancel}
                                                okLabel={v_ok}
                                                ampm={timeFormat === '12'}
                                                value={endDateTime}
                                                onChange={this.changeHandlerEndTime}
                                                keyboardIcon={<ClockIcon />}
                                            />
                                        </div>
                                    </MuiPickersUtilsProvider>
                                </div>
                            </ThemeProvider>
                        )}
                    {!showProjectsList && (
                        <Loading
                            mode="overlay"
                            flag={editMode ? isUpdatingTask : isStartingTask}
                            withLogo={false}
                            width="100%"
                            height="100%"
                        >
                            <button type="submit" className="start-edit-task-modal__submit-button">
                                <span className="start-edit-task-modal__submit-button-text">
                                    {editMode ? v_change : v_start_timer}
                                </span>
                                {!editMode && <PlayIcon className="start-edit-task-modal__submit-button-play-icon" />}
                            </button>
                        </Loading>
                    )}
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentTimer: state.mainPageReducer.currentTimer,
    vocabulary: state.languageReducer.vocabulary,
    projectsList: state.projectReducer.projectsList,
    timeEntriesList: state.mainPageReducer.timeEntriesList,
    timeFormat: state.userReducer.timeFormat,
});

const mapDispatchToProps = {
    showNotificationAction,
    getTimeEntriesListAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StartEditTaskModal);
