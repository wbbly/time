import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

// dependencies
import classNames from 'classnames';

import { getDateInString } from '../../services/timeService';
import { syncAllTasksWithJira } from '../../configAPI';

// Components
import { Loading } from '../../components/Loading';
import TaskListItem from '../../components/TaskListItem';
import AddTask from '../../components/AddTask';
import StartTaskMobile from '../../components/StartTaskMobile';
import TutorialComponent from '../../components/TutorialComponent';
import CustomScrollbar from '../../components/CustomScrollbar';
import { BlankListComponent } from '../../components/CommonComponents/BlankListcomponent/BlankListComponent';

// Actions
import { getProjectsListActions } from '../../actions/ProjectsActions';
import { showNotificationAction } from '../../actions/NotificationActions';
import { getTimeEntriesListAction, restorePaginationAction } from '../../actions/MainPageAction';

// Styles
import './style.scss';
import PageHeader from '../../components/PageHeader';
import TimerSearchComponent from '../../components/TimerSearchComponent';

class MainPage extends Component {
    state = {
        isInitialFetching: true,
    };

    splitTimersByDay = (timers = []) => {
        const formattedLogsDates = [];
        const formattedLogsDatesValues = [];

        for (let i = 0; i < timers.length; i++) {
            const date = moment(timers[i].startDatetime).format('YYYY-MM-DD');
            let index = formattedLogsDates.indexOf(date);
            if (index === -1) {
                formattedLogsDates.push(date);
                index = formattedLogsDates.length - 1;
            }

            if (typeof formattedLogsDatesValues[index] === 'undefined') {
                formattedLogsDatesValues[index] = [];
            }

            formattedLogsDatesValues[index].push(timers[i]);
        }
        return formattedLogsDatesValues;
    };

    renderDayDateString = date => {
        const { dateFormat, vocabulary } = this.props;
        const { lang } = vocabulary;
        const toUpperCaseFirstLetter = date => {
            const day = moment(date)
                .locale(lang.short)
                .format('dddd');
            return day[0].toUpperCase() + day.slice(1);
        };
        return `${toUpperCaseFirstLetter(date)}, ${moment(date).format(dateFormat)}`;
    };

    renderTotalTimeByDay = timers => {
        const { durationTimeFormat } = this.props;
        let totalTime = 0;
        for (let i = 0; i < timers.length; i++) {
            totalTime += +moment(timers[i].endDatetime) - +moment(timers[i].startDatetime);
        }

        return getDateInString(totalTime, durationTimeFormat);
    };

    jiraSynchronizationHandleClick = e => {
        const { vocabulary, showNotificationAction, getTimeEntriesListAction, getProjectsListActions } = this.props;
        const {
            v_jira_synchronization_problem,
            v_jira_synchronization_ok,
            v_jira_synchronization_confirm,
        } = vocabulary;

        if (!window.confirm(v_jira_synchronization_confirm)) return;
        this.setState({
            isInitialFetching: true,
        });

        syncAllTasksWithJira()
            .then(() => {
                getTimeEntriesListAction();
                getProjectsListActions();
            })
            .then(() => {
                showNotificationAction({
                    text: `${v_jira_synchronization_ok}`,
                    type: 'success',
                });
            })
            .catch(err => {
                showNotificationAction({
                    text: `${v_jira_synchronization_problem}`,
                    type: 'error',
                });
            })
            .finally(() => {
                this.setState({
                    isInitialFetching: false,
                });
            });
    };

    async componentDidMount() {
        const { getTimeEntriesListAction, getProjectsListActions } = this.props;
        await getTimeEntriesListAction();
        await getProjectsListActions();
        this.setState({
            isInitialFetching: false,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { currentTimer, getTimeEntriesListAction } = this.props;
        // getting a new task list when stopping or starting
        // a new task without stopping the last task
        if (
            (prevProps.currentTimer && !currentTimer) ||
            (prevProps.currentTimer && currentTimer && prevProps.currentTimer.id !== currentTimer.id)
        ) {
            getTimeEntriesListAction();
        }
    }

    componentWillUnmount() {
        const { restorePaginationAction } = this.props;
        restorePaginationAction();
    }

    render() {
        const {
            isMobile,
            vocabulary,
            timeEntriesList,
            currentTimer,
            isFetchingTimeEntriesList,
            pagination,
            isFetchingSearch,
            isSearchMode,
        } = this.props;
        const { v_total_time, v_timer, v_result } = vocabulary;
        const { isInitialFetching } = this.state;

        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <TutorialComponent>
                    <div
                        className={classNames('main-page', {
                            'main-page--mobile': isMobile,
                        })}
                    >
                        <PageHeader title={v_timer} disabledTitle={isMobile}>
                            <TimerSearchComponent />
                        </PageHeader>
                        <AddTask handleJiraSync={this.jiraSynchronizationHandleClick} />
                        <Loading mode="overlay" withLogo={false} flag={isFetchingSearch} width="100%" height="100%">
                            {isSearchMode && <div className="main-page__results-title">{v_result}</div>}
                            <CustomScrollbar>
                                <div className="main-page__list">
                                    {timeEntriesList &&
                                        timeEntriesList.length === 0 &&
                                        BlankListComponent(
                                            this.props.vocabulary.v_no_entries,
                                            this.props.vocabulary.v_no_entries_sub,
                                            { bottom: '-175px' }
                                        )}
                                    {this.splitTimersByDay(timeEntriesList).map((day, index, arr) => (
                                        <div
                                            className={classNames('main-page__day', {
                                                'main-page__day--last-child': index === arr.length - 1,
                                            })}
                                            key={index}
                                        >
                                            <div className="main-page__day-header">
                                                <div className="main-page__day-date">
                                                    {this.renderDayDateString(day[0].startDatetime)}
                                                </div>
                                                <div className="main-page__day-date-all-time">
                                                    {v_total_time}: {this.renderTotalTimeByDay(day)}
                                                </div>
                                            </div>
                                            {day.map(task => (
                                                <TaskListItem key={task.id} task={task} />
                                            ))}
                                        </div>
                                    ))}
                                    {isFetchingTimeEntriesList && (
                                        <Loading
                                            mode="overlay"
                                            withLogo={false}
                                            flag={isFetchingTimeEntriesList}
                                            width="100%"
                                            height="100%"
                                        >
                                            <div className="main-page__lazy-load-spinner" />
                                        </Loading>
                                    )}
                                    {isMobile &&
                                        !currentTimer &&
                                        pagination.disabled && <div className="main-page__empty-block" />}
                                </div>
                            </CustomScrollbar>
                        </Loading>
                        <StartTaskMobile />
                    </div>
                </TutorialComponent>
            </Loading>
        );
    }
}

const mapStateToProps = state => ({
    timeEntriesList: state.mainPageReducer.timeEntriesList,
    isMobile: state.responsiveReducer.isMobile,
    user: state.userReducer.user,
    dateFormat: state.userReducer.dateFormat,
    durationTimeFormat: state.userReducer.durationTimeFormat,
    currentTimer: state.mainPageReducer.currentTimer,
    pagination: state.mainPageReducer.pagination,
    isFetchingTimeEntriesList: state.mainPageReducer.isFetchingTimeEntriesList,
    isFetchingSearch: state.mainPageReducer.isFetchingSearch,
    isSearchMode: state.mainPageReducer.isSearchMode,
});

const mapDispatchToProps = {
    getTimeEntriesListAction,
    getProjectsListActions,
    restorePaginationAction,
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);
