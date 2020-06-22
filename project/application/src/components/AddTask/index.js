import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import classNames from 'classnames';

import { Loading } from '../../components/Loading';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';

// Styles
import './style.scss';
import { stopTimerSocket, startTimerSocket, updateTimerSocket } from '../../configSocket';
import ProjectsListPopup from '../ProjectsListPopup';

const PlayIcon = props => {
    const { className, onClick } = props;
    return (
        <svg className={className} onClick={onClick} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`${className}-circle`} cx="18" cy="18" r="18" fill="#27AE60" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.3513 16.4372L14.9265 10.1482C14.6478 9.97256 14.3019 10.0018 14.0406 10.0018C12.9954 10.0018 13 10.8565 13 11.073V23.927C13 24.11 12.9954 24.9982 14.0406 24.9982C14.3019 24.9982 14.6479 25.0273 14.9265 24.8517L24.3513 18.5628C25.1248 18.0753 24.9912 17.5 24.9912 17.5C24.9912 17.5 25.1249 16.9247 24.3513 16.4372Z"
                fill="white"
            />
        </svg>
    );
};

const StopIcon = props => {
    const { className, onClick } = props;
    return (
        <svg className={className} onClick={onClick} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={`${className}-circle`} cx="18" cy="18" r="18" fill="#EB5757" />
            <rect x="12" y="12" width="12" height="12" rx="2" fill="white" />
        </svg>
    );
};

const SyncIcon = props => {
    const { className, onClick, name } = props;
    return (
        <svg
            className={className}
            onClick={onClick}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.833252 3.33334V8.33334H5.83325"
                stroke="#C1C0C0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.1668 16.6667V11.6667H14.1667"
                stroke="#C1C0C0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17.0749 7.50001C16.6523 6.30567 15.934 5.23785 14.987 4.39619C14.0401 3.55454 12.8954 2.96648 11.6597 2.68689C10.424 2.4073 9.13762 2.4453 7.92059 2.79732C6.70356 3.14935 5.59554 3.80394 4.69992 4.70001L0.833252 8.33334M19.1666 11.6667L15.2999 15.3C14.4043 16.1961 13.2963 16.8507 12.0792 17.2027C10.8622 17.5547 9.57584 17.5927 8.34016 17.3131C7.10447 17.0335 5.95975 16.4455 5.01281 15.6038C4.06586 14.7622 3.34756 13.6944 2.92492 12.5"
                stroke="#C1C0C0"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <title>{name}</title>
        </svg>
    );
};

class AddTask extends Component {
    state = {
        issue: '',
        projectId: null,
        isUpdating: false,
    };

    updateTaskIssueDebounced = _.debounce(() => {
        const { issue } = this.state;
        updateTimerSocket({
            issue,
        });
    }, 1000);

    static getDerivedStateFromProps(props, state) {
        const { timeEntriesList, currentTimer, projectsList } = props;
        // check first render
        if (state.projectId === null) {
            if (currentTimer) {
                return {
                    issue: currentTimer.issue,
                    projectId: currentTimer.project.id,
                };
            } else {
                const projectId = timeEntriesList[0] ? timeEntriesList[0].project.id : projectsList[0].id;
                return {
                    projectId,
                };
            }
        }
        return null;
    }

    setStateByCurrentTimer = () => {
        const { currentTimer } = this.props;
        this.setState({
            issue: currentTimer.issue,
            projectId: currentTimer.project.id,
        });
    };

    setStateInitial = () => {
        this.setState({
            issue: '',
        });
    };

    startTimer = event => {
        const { showNotificationAction, vocabulary } = this.props;
        const { v_a_task_name_before, v_a_starting, v_a_time_tracking } = vocabulary;
        const { issue, projectId } = this.state;
        if (issue.trim()) {
            this.setState({
                isUpdating: true,
            });
            startTimerSocket({
                issue,
                projectId,
            });
        } else {
            this.setState({
                issue: '',
            });
            showNotificationAction({
                text: `${v_a_task_name_before} ${v_a_starting} ${v_a_time_tracking}`,
                type: 'warning',
            });
        }
    };

    stopTimer = event => {
        const { issue } = this.state;
        const { showNotificationAction, vocabulary } = this.props;
        const { v_a_task_name_before, v_a_stopping, v_a_time_tracking } = vocabulary;
        if (issue.trim()) {
            this.setState({
                isUpdating: true,
            });
            stopTimerSocket();
        } else {
            this.setState({
                issue: '',
            });
            showNotificationAction({
                text: `${v_a_task_name_before} ${v_a_stopping} ${v_a_time_tracking}`,
                type: 'warning',
            });
        }
    };

    onChangeInput = event => {
        const { currentTimer } = this.props;
        const value = event.target.value;

        this.setState({
            issue: value,
        });

        if (currentTimer && currentTimer.issue === value.trim()) {
            this.setState({ isUpdating: false }, () => this.updateTaskIssueDebounced.cancel());
        } else if (currentTimer && currentTimer.issue !== value.trim() && currentTimer && value.trim()) {
            this.setState({ isUpdating: true }, () => this.updateTaskIssueDebounced());
        }
    };

    onChangeProject = id => {
        const { currentTimer } = this.props;
        const { issue } = this.state;
        if (currentTimer) {
            this.setState({
                isUpdating: true,
            });
            updateTimerSocket({
                projectId: id,
                issue,
            });
        } else {
            this.setState({
                projectId: id,
            });
        }
    };

    componentDidUpdate(prevProps, prevState) {
        const { isUpdating, issue } = this.state;
        const { currentTimer: curr } = this.props;
        const prev = prevProps.currentTimer;
        if (!_.isEqual(prev, curr)) {
            // Start timer
            if (!prev && curr) {
                this.setStateByCurrentTimer();
                this.setState({
                    isUpdating: false,
                });
            }
            // Stop timer
            else if (prev && !curr) {
                this.setStateInitial();
                this.setState({
                    isUpdating: false,
                });
            }
            // Start new task without stop last task
            else if (prev && curr && prev.id !== curr.id) {
                this.setStateByCurrentTimer();
                this.setState({
                    isUpdating: false,
                });
            }
            // Update task
            else if (prev && curr && prev.id === curr.id) {
                // Check update issue
                if (prev.issue !== curr.issue) {
                }
                // Check update project
                else if (prev.project.id !== curr.project.id) {
                    this.setStateByCurrentTimer();
                }
                this.setState({
                    isUpdating: false,
                });
            }
        } else {
            if (isUpdating && !issue) {
                this.setState({
                    isUpdating: false,
                });
            }
        }
    }

    render() {
        const { issue, projectId, isUpdating } = this.state;
        const { currentTimer, vocabulary, timerTick, isMobile, handleJiraSync, user } = this.props;
        const { v_add_your_task_name, v_jira_synchronization } = vocabulary;
        return (
            !isMobile && (
                <div className={classNames('add-task')}>
                    <input
                        onFocus={event => (event.target.placeholder = '')}
                        onBlur={event => (event.target.placeholder = v_add_your_task_name)}
                        onKeyDown={event => event.keyCode === 13 && !currentTimer && !isUpdating && this.startTimer()}
                        type="text"
                        value={issue}
                        onChange={this.onChangeInput}
                        placeholder={v_add_your_task_name}
                        className="add-task__input"
                    />
                    {user.tokenJira && (
                        <SyncIcon
                            className={classNames('add-task__sync')}
                            onClick={handleJiraSync}
                            name={v_jira_synchronization}
                        />
                    )}
                    <ProjectsListPopup
                        withFolder
                        disabled={isUpdating}
                        onChange={this.onChangeProject}
                        selectedProjectId={projectId}
                    />
                    <span className="add-task__duration">{timerTick ? timerTick : '00:00:00'}</span>
                    <Loading mode="overlay" flag={isUpdating} withLogo={false} circle width="3.6rem" height="3.6rem">
                        {currentTimer ? (
                            <StopIcon className={classNames('add-task__stop-icon')} onClick={this.stopTimer} />
                        ) : (
                            <PlayIcon className={classNames('add-task__play-icon')} onClick={this.startTimer} />
                        )}
                    </Loading>
                </div>
            )
        );
    }
}

const mapStateToProps = state => ({
    currentTimer: state.mainPageReducer.currentTimer,
    vocabulary: state.languageReducer.vocabulary,
    projectsList: state.projectReducer.projectsList,
    timeEntriesList: state.mainPageReducer.timeEntriesList,
    timerTick: state.mainPageReducer.timerTick,
    user: state.userReducer.user,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddTask);
