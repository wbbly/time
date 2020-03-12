import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
// dependencies
import classNames from 'classnames';

import { getDateInString } from '../../services/timeService';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';

// Components
import { Loading } from '../../components/Loading';
import TaskListItem from '../../components/TaskListItem';
import AddTask from '../../components/AddTask';
import StartTaskMobile from '../../components/StartTaskMobile';
import NewTutorial from '../../components/NewTutorial';
import CustomScrollbar from '../../components/CustomScrollbar';
import ModalPortal from '../../components/ModalPortal';

// Actions
import { getTimeEntriesListAction, restorePaginationAction } from '../../actions/MainPageAction';
import { getProjectsListActions } from '../../actions/ProjectsActions';

// Styles
import './style.scss';
import { WindowScroller } from 'react-virtualized';

class MainPage extends Component {
    state = {
        isInitialFetching: true,
    };

    listRef = React.createRef();

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

    _getDatum = index => {
        const { timeEntriesList } = this.props;
        const list = this.splitTimersByDay(timeEntriesList);
        return list[index];
    };

    _getRowHeight = ({ index }) => {
        //todo new algorithm needed
        const datumLength = this._getDatum(index).length;
        const containerSize = 36;
        const marginBottomSize = 26;
        const listItemSize = 58;
        return containerSize + marginBottomSize + listItemSize * datumLength;
    };

    _rowRenderer = ({ index, key, style, length }) => {
        const { vocabulary } = this.props;
        const { v_total_time } = vocabulary;

        const datum = this._getDatum(index);

        let additionalContent;

        return (
            <div key={key} style={style}>
                <div
                    className={classNames('main-page__day', {
                        'main-page__day--last-child': index === length - 1,
                    })}
                >
                    <div className="main-page__day-header">
                        <div className="main-page__day-date">{this.renderDayDateString(datum[0].startDatetime)}</div>
                        <div className="main-page__day-date-all-time">
                            {v_total_time}: {this.renderTotalTimeByDay(datum)}
                        </div>
                    </div>
                    {datum.map(task => (
                        <TaskListItem key={task.id} task={task} />
                    ))}
                </div>
            </div>
        );
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
        const { currentTimer, getTimeEntriesListAction, timeEntriesList } = this.props;
        // getting a new task list when stopping or starting
        // a new task without stopping the last task

        if (
            (prevProps.currentTimer && !currentTimer) ||
            (prevProps.currentTimer && currentTimer && prevProps.currentTimer.id !== currentTimer.id)
        ) {
            getTimeEntriesListAction();
        }

        if (prevProps.timeEntriesList.length !== timeEntriesList.length) {
            if (this.listRef && this.listRef.current) this.listRef.current.recomputeRowHeights(0);
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
            user,
        } = this.props;
        const { v_total_time } = vocabulary;
        const { isInitialFetching } = this.state;
        const dividedTimersByDay = this.splitTimersByDay(timeEntriesList);
        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                {user.onboardingMobile ? (
                    <ModalPortal>
                        <NewTutorial />
                    </ModalPortal>
                ) : (
                    <div
                        className={classNames('main-page', {
                            'main-page--mobile': isMobile,
                        })}
                    >
                        <AddTask />
                        <CustomScrollbar>
                            <WindowScroller>
                                {({ height }) => (
                                    <AutoSizer>
                                        {({ width }) => [
                                            <List
                                                ref={this.listRef}
                                                className="main-page__list"
                                                height={height}
                                                autoHeight
                                                overscanRowCount={10}
                                                noRowsRenderer={<div />}
                                                rowCount={dividedTimersByDay.length}
                                                rowHeight={this._getRowHeight}
                                                rowRenderer={props =>
                                                    this._rowRenderer({
                                                        ...props,
                                                        length: dividedTimersByDay.length,
                                                    })
                                                }
                                                width={width - 17} //todo calculate width by another way
                                            />,
                                            isFetchingTimeEntriesList && (
                                                <Loading
                                                    mode="overlay"
                                                    withLogo={false}
                                                    flag={isFetchingTimeEntriesList}
                                                    width={width - 17} //todo calculate width by another way
                                                    height={100}
                                                >
                                                    <div className="main-page__lazy-load-spinner" />
                                                </Loading>
                                            ),
                                            isMobile &&
                                                !currentTimer &&
                                                pagination.disabled && (
                                                    <div
                                                        style={{ width: width - 17 }}
                                                        className="main-page__empty-block"
                                                    />
                                                ), //todo calculate width by another way
                                        ]}
                                    </AutoSizer>
                                )}
                            </WindowScroller>

                            {/*<div className="main-page__list">*/}
                            {/*    {this.splitTimersByDay(timeEntriesList).map((day, index, arr) => (*/}
                            {/*        <div*/}
                            {/*            className={classNames('main-page__day', {*/}
                            {/*                'main-page__day--last-child': index === arr.length - 1,*/}
                            {/*            })}*/}
                            {/*            key={index}*/}
                            {/*        >*/}
                            {/*            <div className="main-page__day-header">*/}
                            {/*                <div className="main-page__day-date">*/}
                            {/*                    {this.renderDayDateString(day[0].startDatetime)}*/}
                            {/*                </div>*/}
                            {/*                <div className="main-page__day-date-all-time">*/}
                            {/*                    {v_total_time}: {this.renderTotalTimeByDay(day)}*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*            {day.map(task => (*/}
                            {/*                <TaskListItem key={task.id} task={task} />*/}
                            {/*            ))}*/}
                            {/*        </div>*/}
                            {/*    ))}*/}
                            {/*    {isFetchingTimeEntriesList && (*/}
                            {/*        <Loading*/}
                            {/*            mode="overlay"*/}
                            {/*            withLogo={false}*/}
                            {/*            flag={isFetchingTimeEntriesList}*/}
                            {/*            width="100%"*/}
                            {/*            height="100%"*/}
                            {/*        >*/}
                            {/*            <div className="main-page__lazy-load-spinner" />*/}
                            {/*        </Loading>*/}
                            {/*    )}*/}
                            {/*    {isMobile &&*/}
                            {/*        !currentTimer &&*/}
                            {/*        pagination.disabled && <div className="main-page__empty-block" />}*/}
                            {/*</div>*/}
                        </CustomScrollbar>
                        <StartTaskMobile />
                    </div>
                )}
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
});

const mapDispatchToProps = {
    getTimeEntriesListAction,
    getProjectsListActions,
    restorePaginationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);
