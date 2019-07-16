import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import * as moment from 'moment';
import { showMobileSupportToastr } from '../../App';

// dependencies
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { BrowserView, isSafari, isIOS } from 'react-device-detect';

// Services
import { userLoggedIn, logoutByUnauthorized } from '../../services/authentication';
import { getDateInString, getTimeDiff, getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { encodeTimeEntryIssue, decodeTimeEntryIssue } from '../../services/timeEntryService';
import { getTokenFromLocalStorage } from '../../services/tokenStorageService';
import {
    removeCurrentTimerFromLocalStorage,
    setCurrentTimerToLocalStorage,
} from '../../services/currentTimerStorageService';
import { setServerClientTimediffToLocalStorage } from '../../services/serverClientTimediffStorageService';
import { apiCall } from '../../services/apiService';

// Components
import ManualTimeModal from '../../components/ManualTimeModal';

// Actions
import addTasks from '../../actions/MainPageAction';
import manualTimerModalAction from '../../actions/ManualTimerModalAction';

// Queries
import { getProjectListParseFunction, getTodayTimeEntriesParseFunction } from '../../queries';

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class MainPage extends Component {
    ONE_SECOND_PERIOD = 1000; // in ms
    TIMER_LIVE_SUBSCRIPTION;
    TIMER_MANUAL_UPDATE_SUBSCRIPTION;
    editingTaskName = false;
    socketConnection;
    issueTargetElement;
    projectListTargetElement;
    projectSearchTextTargetElement;
    defaultProject = {
        id: 'f339b6b6-d044-44f3-8887-684e112f7cfd',
        name: 'any',
        projectColor: {
            name: 'green',
        },
    };
    state = {
        timerReadyToUse: false,
        timerPlayButtonShow: true,
        timerPlayButtonLoader: false,
        timerDurationValue: null,
        timerStartTime: undefined,
        seletedProject: null,
        timeEntriesList: [],
        projectList: [],
        projectListForModalWindow: [],
        projectListInitial: [],
        projectListIsOpen: false,
        isShowAddTaskMobile: false,
        isShowListProjectsMobile: false,
    };

    initSocketConnection() {
        // console.log('this.initSocketConnection')
        this.socketConnection = openSocket(AppConfig.apiURL);
        this.socketConnection.on('connect', () => {
            this.socketConnection.emit(
                'join-v2',
                {
                    token: `Bearer ${getTokenFromLocalStorage()}`,
                },
                _ => {
                    this.socketConnection.emit('check-timer-v2', {
                        token: `Bearer ${getTokenFromLocalStorage()}`,
                    });
                }
            );
        });
        this.socketConnection.on('check-timer-v2', data => {
            if (data && typeof this.TIMER_MANUAL_UPDATE_SUBSCRIPTION === 'undefined') {
                // console.log('this.initSocketConnection WORKING')
                apiCall(AppConfig.apiURL + 'time/current', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(
                    result => {
                        setServerClientTimediffToLocalStorage(+moment(result.timeISO) - +moment());
                        const currentTimer = {
                            timeStart: +moment(data.startDatetime),
                            issue: decodeTimeEntryIssue(data.issue),
                            project: data.project,
                        };
                        setCurrentTimerToLocalStorage(currentTimer);
                        this.timerStateUpdateWithSocketData(currentTimer);
                    },
                    err => {
                        if (err instanceof Response) {
                            err.text().then(errorMessage => console.log(errorMessage));
                        } else {
                            console.log(err);
                        }
                    }
                );
            } else if (!data) {
                removeCurrentTimerFromLocalStorage();
                const lastTimeEntry = this.props.timeEntriesList[0];
                const seletedProject = lastTimeEntry ? lastTimeEntry.project : this.defaultProject;
                this.setState({ seletedProject, timerReadyToUse: true });
            }
        });
        this.socketConnection.on('stop-timer-v2', data => {
            clearInterval(this.TIMER_LIVE_SUBSCRIPTION);
            this.TIMER_LIVE_SUBSCRIPTION = undefined;
            this.timerStop();
        });
        this.socketConnection.on('user-unauthorized', data => {
            return logoutByUnauthorized();
        });
    }

    timerPlayStopButtonAction(className, projectId) {
        // console.log('this.timerPlayStopButtonAction')
        const { vocabulary } = this.props;
        const { v_a_task_name_before, v_a_starting, v_a_stopping, v_a_time_tracking } = vocabulary;
        let issue = (this.issueTargetElement || {}).value || '';
        issue = issue.trim();
        if (issue.length) {
            this.setState({ timerPlayButtonLoader: true }, () => {
                if (className === 'control_task_time_icons play') {
                    const issue = (this.issueTargetElement || {}).value || '';
                    this.socketConnection &&
                        this.socketConnection.emit('start-timer-v2', {
                            token: `Bearer ${getTokenFromLocalStorage()}`,
                            issue: encodeTimeEntryIssue(issue),
                            projectId: projectId,
                        });
                } else {
                    this.socketConnection &&
                        this.socketConnection.emit('stop-timer-v2', {
                            token: `Bearer ${getTokenFromLocalStorage()}`,
                        });
                }
            });
        } else {
            alert(
                `${v_a_task_name_before} ${
                    className === 'control_task_time_icons play' ? v_a_starting : v_a_stopping
                } ${v_a_time_tracking}`
            );
        }
    }

    timerTickStart() {
        // console.log('this.timerTickStart')
        clearInterval(this.TIMER_LIVE_SUBSCRIPTION);
        this.TIMER_LIVE_SUBSCRIPTION = undefined;

        this.setState({ timerDurationValue: getTimeDiff(this.state.timerStartTime) });
        this.TIMER_LIVE_SUBSCRIPTION = setInterval(
            () => this.setState({ timerDurationValue: getTimeDiff(this.state.timerStartTime) }),
            this.ONE_SECOND_PERIOD
        );
        this.setState({ isShowAddTaskMobile: false });
    }

    timerUpdate() {
        // console.log('this.timerUpdate RUN')
        if (!this.state.timerDurationValue) return;
        // console.log('this.timerUpdate WORKING')
        clearTimeout(this.TIMER_MANUAL_UPDATE_SUBSCRIPTION);
        this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = undefined;

        this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = setTimeout(() => {
            if (this.TIMER_LIVE_SUBSCRIPTION) {
                const issue = (this.issueTargetElement || {}).value || '';
                this.socketConnection &&
                    this.socketConnection.emit('update-timer-v2', {
                        token: `Bearer ${getTokenFromLocalStorage()}`,
                        issue: encodeTimeEntryIssue(issue),
                        projectId: this.state.seletedProject.id,
                    });
            }

            clearTimeout(this.TIMER_MANUAL_UPDATE_SUBSCRIPTION);
            this.TIMER_MANUAL_UPDATE_SUBSCRIPTION = undefined;
        }, this.ONE_SECOND_PERIOD);
    }

    timerStop() {
        removeCurrentTimerFromLocalStorage();
        this.getUserTimeEntries().then(
            _ => {
                this.setState(
                    {
                        timerPlayButtonShow: !this.state.timerPlayButtonShow,
                        timerPlayButtonLoader: false,
                        timerDurationValue: null,
                        timerStartTime: undefined,
                    },
                    () => {
                        if (!!this.issueTargetElement) {
                            this.issueTargetElement.value = '';
                        }
                    }
                );
            },
            _ => {}
        );
    }

    timerStateUpdateWithSocketData(socketData) {
        // console.log('timerStateUpdateWithSocketData');
        if (!socketData || !socketData.timeStart) {
            // console.log('timerStateUpdateWithSocketData STOP');
            return false;
        }

        if (!!this.issueTargetElement && !this.editingTaskName) {
            // console.log('timerStateUpdateWithSocketData INPUT NEW VALUE');
            this.issueTargetElement.value = socketData.issue;
        }

        this.setState(
            {
                timerPlayButtonShow: false,
                timerPlayButtonLoader: false,
                timerStartTime: socketData.timeStart || +moment(),
                seletedProject: socketData.project,
                timerReadyToUse: true,
            },
            () => this.timerTickStart()
        );
    }

    timerContinue(name = '', item) {
        const { vocabulary } = this.props;
        const { v_a_task_name_before, v_a_starting, v_a_time_tracking } = vocabulary;
        name = name.trim();
        if (name.length) {
            this.issueTargetElement.value = name;
            this.setState({ seletedProject: item.project }, () =>
                this.timerPlayStopButtonAction('control_task_time_icons play', item.project.id)
            );
        } else {
            alert(`${v_a_task_name_before} ${v_a_starting} ${v_a_time_tracking}`);
        }
    }

    getTimeEntriesTotalTime(items) {
        let totalTime = 0;
        for (let i = 0; i < items.length; i++) {
            totalTime += +moment(items[i].endDatetime) - +moment(items[i].startDatetime);
        }

        return getDateInString(totalTime);
    }

    projectListToggle() {
        this.setState({ projectListIsOpen: !this.state.projectListIsOpen }, () => {
            if (this.state.projectListInitial) {
                this.findProjectByName();
            }
        });
    }

    setActiveProject(project) {
        this.setState({ seletedProject: project }, () => this.timerUpdate());
    }

    findProjectByName(name = '') {
        if (name.length) {
            name = name.toLowerCase();
            let finishArr = this.state.projectListInitial.filter(it => {
                let values = [];
                values.push(it['name']);

                return (
                    JSON.stringify(values)
                        .toLowerCase()
                        .indexOf(name) > -1
                );
            });
            this.setState({ projectListForModalWindow: finishArr });
        } else {
            this.setState({ projectListForModalWindow: this.state.projectListInitial });
        }
    }

    splitProjectsByDates(items = []) {
        const formattedLogsDates = [];
        const formattedLogsDatesValues = [];

        for (let i = 0; i < items.length; i++) {
            const date = moment(items[i].startDatetime).format('YYYY-MM-DD');
            let index = formattedLogsDates.indexOf(date);
            if (index === -1) {
                formattedLogsDates.push(date);
                index = formattedLogsDates.length - 1;
            }

            if (typeof formattedLogsDatesValues[index] === 'undefined') {
                formattedLogsDatesValues[index] = [];
            }

            formattedLogsDatesValues[index].push(items[i]);
        }

        return formattedLogsDatesValues;
    }

    deleteTimeEntry(item) {
        const { vocabulary } = this.props;
        const { v_a_task_delete } = vocabulary;
        let check = window.confirm(v_a_task_delete);
        if (check) {
            apiCall(AppConfig.apiURL + `timer/${item.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(
                _ => {
                    this.getUserTimeEntries().then(_ => {}, _ => {});
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
    }

    getUserTimeEntries() {
        return new Promise((resolve, reject) => {
            //@TODO Add association w/ Teams
            apiCall(AppConfig.apiURL + `timer/user-list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(
                result => {
                    const { timerV2: timeEntriesList } = getTodayTimeEntriesParseFunction(result.data);
                    this.props.addTasksAction('ADD_TASKS_ARR', { timeEntriesList });
                    resolve();
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => console.log(errorMessage));
                    } else {
                        console.log(err);
                    }
                    reject();
                }
            );
        });
    }

    getProjectList() {
        return new Promise((resolve, reject) => {
            apiCall(AppConfig.apiURL + `project/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(
                result => {
                    let dataParsed = getProjectListParseFunction(result);
                    const projectV2 = dataParsed.projectV2;
                    this.setState({
                        projectList: projectV2,
                        projectListForModalWindow: projectV2,
                        projectListInitial: projectV2,
                    });
                    this.defaultProject.id = projectV2[0].id;
                    this.defaultProject.name = projectV2[0].name;
                    this.defaultProject.projectColor.name = projectV2[0].projectColor.name;
                    resolve(true);
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => console.log(errorMessage));
                    } else {
                        console.log(err);
                    }
                    resolve(true);
                }
            );
        });
    }

    async componentDidMount() {
        showMobileSupportToastr();
        await this.getProjectList();
        await this.getUserTimeEntries();
        this.initSocketConnection();
    }

    componentWillUnmount() {
        this.socketConnection && this.socketConnection.emit('leave');
    }

    toggleSwipe = event => {
        event.persist();
        const { viewport } = this.props;
        let target = event.currentTarget;
        if (viewport.width >= 1024) return;
        if (event.target.tagName === 'I') return;
        if (this.swipedElement && this.swipedElement !== target) {
            this.swipedElement.className = 'ul';
        }
        target.className === 'ul' ? (target.className = 'ul swipe') : (target.className = 'ul');
        this.swipedElement = target;
    };

    createTimeEntriesList(data) {
        const { viewport, isMobile, vocabulary } = this.props;
        const { v_edit_task, v_delete_task } = vocabulary;
        let items = data.map(item => (
            <div className="ul" key={item.id} onClick={this.toggleSwipe}>
                <div className="li">
                    <div className="name_container">
                        <div className="name">{item.issue}</div>
                        <div className="project_name">
                            <span className={`circle ${item.project.projectColor.name}`} />
                            <span className="project_name__name">{item.project.name}</span>
                        </div>
                    </div>
                    <div
                        className="time_container_history"
                        onClick={event => {
                            event.stopPropagation();
                            if (!isMobile && event.target.className !== 'small_play item_button') return;
                            if (this.swipedElement) {
                                if (this.swipedElement.className === 'ul swipe') {
                                    this.swipedElement.click();
                                }
                            }
                            this.state.timerReadyToUse && this.timerContinue(item.issue, item);
                        }}
                    >
                        <div className="time_now">
                            <div>{moment(item.startDatetime).format('HH:mm')}</div>-{' '}
                            <div>{moment(item.endDatetime).format('HH:mm')}</div>
                        </div>
                        <div className="timePassed">
                            {getTimeDurationByGivenTimestamp(+moment(item.endDatetime) - +moment(item.startDatetime))}
                        </div>
                        {!this.state.timerDurationValue && <i className="small_play item_button" />}
                        <i
                            className="edit_button item_button"
                            onClick={event => {
                                event.stopPropagation();
                                this.props.addTasksAction('SET_EDITED_ITEM', { editedItem: item });
                                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: true });
                            }}
                        />
                        <i
                            className="cancel item_button"
                            onClick={event => {
                                event.stopPropagation();
                                this.deleteTimeEntry(item);
                            }}
                        />
                    </div>
                </div>
                {viewport.width < 1024 && (
                    <div className="edit">
                        <div
                            className="edit_swipe"
                            onClick={event => {
                                event.stopPropagation();
                                if (this.swipedElement) {
                                    if (this.swipedElement.className === 'ul swipe') {
                                        this.swipedElement.click();
                                    }
                                }
                                this.props.addTasksAction('SET_EDITED_ITEM', { editedItem: item });
                                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: true });
                            }}
                        >
                            <i className="edit-icon-swipe" />
                            {v_edit_task}
                        </div>
                        <div
                            className="delete_swipe"
                            onClick={event => {
                                event.stopPropagation();
                                this.deleteTimeEntry(item);
                            }}
                        >
                            <i className="delete-icon-swipe" />
                            {v_delete_task}
                        </div>
                    </div>
                )}
            </div>
        ));

        return items;
    }

    checkSwipe = () => {
        return this.swipedElement && this.swipedElement.className === 'ul swipe';
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.isShowMenu && this.props.isShowMenu && this.checkSwipe()) {
            this.swipedElement.click();
        }

        if (this.state.isShowAddTaskMobile && this.checkSwipe()) {
            this.swipedElement.click();
        }
    }

    render() {
        // console.log('render');

        // console.log('this.state.timerStartTime', this.state.timerStartTime);
        // console.log('this.state.timerDurationValue', this.state.timerDurationValue);
        // console.log(
        //     'getTimeDurationByGivenTimestamp(+moment(this.state.timerDurationValue))',
        //     getTimeDurationByGivenTimestamp(+moment(this.state.timerDurationValue))
        // );

        // console.log('+moment()', +moment());
        // console.log('getTimeDiff(null)', getTimeDiff(null));
        // console.log('+moment(getTimeDiff(null))', +moment(getTimeDiff(null)));
        // console.log(
        //     'getTimeDurationByGivenTimestamp(+moment(getTimeDiff(null)))',
        //     getTimeDurationByGivenTimestamp(+moment(getTimeDiff(null)))
        // );
        // console.log(
        //     'getTimeDurationByGivenTimestamp(+moment(getTimeDiff(undefined)))',
        //     getTimeDurationByGivenTimestamp(+moment(getTimeDiff(undefined)))
        // );

        const { isMobile, vocabulary } = this.props;
        const { v_total_time, v_add_your_task_name, v_find, v_start_timer, v_task_name, v_search_project } = vocabulary;
        if (!userLoggedIn()) return <Redirect to={'/login'} />;

        const buttonState = this.state.timerPlayButtonShow ? 'play' : 'stop';
        const buttonClassName = ['control_task_time_icons', buttonState].join(' ');
        let timeTrackerWrapperItems = this.splitProjectsByDates(this.props.timeEntriesList).map((arraysItem, index) => (
            <div className="time_tracker_wrapper" key={'time-entry-group_' + index}>
                <div className="header">
                    <div className="date">{moment(arraysItem[0].startDatetime).format('DD.MM.YYYY')}</div>
                    <div className="allTime">
                        {v_total_time}: {this.getTimeEntriesTotalTime(arraysItem)}
                    </div>
                </div>
                {this.createTimeEntriesList(arraysItem)}
            </div>
        ));
        return (
            <div
                className={classNames('wrapper_main_page', {
                    'wrapper_main_page--mobile': isMobile,
                })}
            >
                {this.props.manualTimerModal.manualTimerModalToggle && (
                    <ManualTimeModal
                        timeEntriesList={this.props.timeEntriesList}
                        editedItem={this.props.editedItem}
                        projectList={this.state.projectListInitial}
                        addTasksAction={this.props.addTasksAction}
                        manualTimerModalAction={this.props.manualTimerModalAction}
                    />
                )}
                <div className="data_container">
                    <div className="add_task_container">
                        <input
                            type="text"
                            className="add_task"
                            placeholder={v_add_your_task_name}
                            ref={input => {
                                this.issueTargetElement = input;
                            }}
                            onChange={e => this.timerUpdate()}
                            onFocus={e => {
                                e.target.placeholder = '';
                                this.editingTaskName = true;
                            }}
                            onBlur={e => {
                                e.target.placeholder = v_add_your_task_name;
                                this.editingTaskName = false;
                            }}
                            onKeyUp={event => {
                                if (event.keyCode === 13 && !this.state.timerDurationValue) {
                                    this.state.timerReadyToUse &&
                                        this.timerPlayStopButtonAction(buttonClassName, this.state.seletedProject.id);
                                }
                            }}
                        />
                        <div className="wrapper-timer-mobile">
                            {this.state.timerReadyToUse && (
                                <div className="active_project">
                                    <span
                                        className={`projects_modal_item_circle ${
                                            this.state.seletedProject.projectColor.name
                                        }`}
                                    />
                                    <span className="projects_modal_item_name">{this.state.seletedProject.name}</span>
                                </div>
                            )}
                            <i className="folder" onClick={e => this.projectListToggle()}>
                                {this.state.projectListIsOpen && (
                                    <div
                                        className="projects_modal_wrapper"
                                        ref={div => (this.projectListTargetElement = div)}
                                    >
                                        <div
                                            className="projects_modal_wrapper_header"
                                            onClick={event => {
                                                event.stopPropagation();
                                            }}
                                        >
                                            <input
                                                placeholder={`${v_find}...`}
                                                type="text"
                                                ref={input => (this.projectSearchTextTargetElement = input)}
                                                onKeyUp={e =>
                                                    this.findProjectByName(this.projectSearchTextTargetElement.value)
                                                }
                                                className="projects_modal_wrapper_search"
                                            />
                                        </div>
                                        <div className="projects_modal_data_wrapper">
                                            {this.state.projectListForModalWindow.map((item, index) => (
                                                <div
                                                    key={'timer-project-' + index}
                                                    className="projects_modal_item"
                                                    onClick={e => this.setActiveProject(item)}
                                                >
                                                    <div
                                                        className={`projects_modal_item_circle ${
                                                            item.projectColor.name
                                                        }`}
                                                    />
                                                    <div className="projects_modal_item_name">{item.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </i>

                            <div className="time_container">
                                {this.state.timerDurationValue
                                    ? getTimeDurationByGivenTimestamp(+moment(this.state.timerDurationValue))
                                    : '00:00:00'}
                            </div>
                            <i
                                onClick={_ => {
                                    if (this.state.timerPlayButtonLoader) return;
                                    this.state.timerReadyToUse &&
                                        this.timerPlayStopButtonAction(buttonClassName, this.state.seletedProject.id);
                                }}
                                className={classNames(buttonClassName, {
                                    'disabled-play': this.state.timerPlayButtonLoader,
                                })}
                            />
                        </div>
                    </div>
                    {BrowserView && !isSafari && !isIOS ? (
                        <Scrollbars>
                            <div className="main_wrapper_tracker_items">
                                {timeTrackerWrapperItems}
                                {!this.state.timerDurationValue && <div className="empty-block" />}
                            </div>
                        </Scrollbars>
                    ) : (
                        <div className="main_wrapper_tracker_items">
                            {timeTrackerWrapperItems}
                            {!this.state.timerDurationValue && <div className="empty-block" />}
                        </div>
                    )}
                </div>

                {/* START BLOCK BUTTON PLAY AND STATUS CURRENT TASK MOBILE */}
                {!this.state.timerDurationValue ? (
                    !this.state.isShowAddTaskMobile && (
                        <div
                            className="play mobile-play-button-large"
                            onClick={event => this.setState({ isShowAddTaskMobile: true })}
                        />
                    )
                ) : (
                    <div className="mobile-info-block-current-going-task">
                        <div className="mobile-info-block-current-going-task__time">
                            {this.state.timerDurationValue
                                ? getTimeDurationByGivenTimestamp(+moment(this.state.timerDurationValue))
                                : '00:00:00'}
                        </div>
                        <div className="mobile-info-block-current-going-task__name-task">
                            {(this.issueTargetElement || {}).value || ''}
                        </div>
                        <div
                            className="mobile-info-block-current-going-task__stop"
                            onClick={event => {
                                this.setState({ isShowAddTaskMobile: false });
                                this.state.timerReadyToUse &&
                                    this.timerPlayStopButtonAction(buttonClassName, this.state.seletedProject.id);
                            }}
                        >
                            <span className="stop" />
                        </div>
                    </div>
                )}
                {/* END BLOCK BUTTON PLAY AND STATUS CURRENT TASK MOBILE */}

                {/* START BLOCK ADD TASK MOBILE */}
                {!this.state.timerDurationValue &&
                    this.state.isShowAddTaskMobile && (
                        <div
                            className={
                                !this.state.isShowAddTaskMobile
                                    ? 'wrapper-add-task-mobile'
                                    : 'wrapper-add-task-mobile wrapper-add-task-mobile--show'
                            }
                        >
                            <div className="add-task-mobile">
                                <div
                                    className="icon-close-mobile"
                                    onClick={event => this.setState({ isShowAddTaskMobile: false })}
                                />
                                <div className="add-task-mobile__label-input">{v_task_name}</div>
                                <input
                                    type="text"
                                    className="add_task"
                                    placeholder={v_add_your_task_name}
                                    onChange={event => (this.issueTargetElement.value = event.target.value)}
                                    // onKeyUp={e => this.timerUpdate()}
                                    onFocus={e => {
                                        e.target.placeholder = '';
                                    }}
                                    onBlur={e => {
                                        e.target.placeholder = v_add_your_task_name;
                                    }}
                                />
                                <div
                                    className="projects_modal_wrapper"
                                    ref={div => (this.projectListTargetElement = div)}
                                >
                                    <div
                                        className="projects_modal_wrapper_header"
                                        onClick={event => {
                                            event.stopPropagation();
                                        }}
                                    >
                                        <div className="add-task-mobile__label-input">{v_search_project}</div>
                                        <div className="add-task-mobile__wrapper-serach">
                                            <input
                                                placeholder={`${v_find}...`}
                                                type="text"
                                                ref={input => (this.projectSearchTextTargetElement = input)}
                                                defaultValue={
                                                    this.state.seletedProject ? this.state.seletedProject.name : ''
                                                }
                                                onKeyUp={e => {
                                                    this.projectSearchTextTargetElement.value = e.target.value;
                                                    this.findProjectByName(this.projectSearchTextTargetElement.value);
                                                }}
                                                onFocus={event => this.setState({ isShowListProjectsMobile: true })}
                                                className="projects_modal_wrapper_search"
                                                readOnly
                                            />
                                            <span
                                                className={`projects_modal_item_circle_search ${
                                                    this.state.seletedProject
                                                        ? this.state.seletedProject.projectColor.name
                                                        : ''
                                                }`}
                                            />
                                        </div>
                                    </div>
                                    {this.state.isShowListProjectsMobile &&
                                        this.state.projectListForModalWindow.length && (
                                            <div className="projects_modal_data_wrapper">
                                                {this.state.projectListForModalWindow.map((item, index) => (
                                                    <div
                                                        key={'timer-project-' + index}
                                                        className="projects_modal_item"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.projectSearchTextTargetElement.value = item.name;
                                                            this.setActiveProject(item);
                                                            this.setState({ isShowListProjectsMobile: false });
                                                        }}
                                                    >
                                                        <div
                                                            className={`projects_modal_item_circle ${
                                                                item.projectColor.name
                                                            }`}
                                                        />
                                                        <div className="projects_modal_item_name">{item.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                                {!this.state.isShowListProjectsMobile && (
                                    <button
                                        className="add-task-button-mobile"
                                        onClick={_ => {
                                            this.state.timerReadyToUse &&
                                                this.timerPlayStopButtonAction(
                                                    buttonClassName,
                                                    this.state.seletedProject.id
                                                );
                                        }}
                                    >
                                        {v_start_timer}
                                        <span className="add-task-button-mobile-play" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                {/* END BLOCK ADD TASK MOBILE */}
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        timeEntriesList: store.mainPageReducer.timeEntriesList,
        editedItem: store.mainPageReducer.editedItem,
        manualTimerModal: store.manualTimerModalReducer,
        viewport: store.responsiveReducer.viewport,
        isShowMenu: store.responsiveReducer.isShowMenu,
        isMobile: store.responsiveReducer.isMobile,
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
