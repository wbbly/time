import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

//---COMPONENTS---
import ModalPortal from '../../components/ModalPortal';
import PlaningUserBlock from '../../components/PlaningUserBlock';
import AddUserProject from '../../components/PlaningAddUserProject';
import { AddPlan } from '../../components/PlaningAddPlan';
import { AddTimeOff } from '../../components/PlaningAddTimeOff';

//---SERVICES---
import { apiCall } from '../../services/apiService';

//---ACTIONS---
import {
    createMonthArray,
    nextMonth,
    prevMonth,
    currentMonth,
    addUser,
    changeUserOpenFlag,
    changeTimeOffFlag,
    changeAllTimeOff,
    openDayOffChangeWindow,
    getTimerPlaningList,
    setSelectedUsers,
    setCurrentTeam,
    deleteUser,
    getProjects,
} from '../../actions/PlaningActions';
import projectsPageAction from '../../actions/ProjectsActions';

// Queries
import { getProjectsV2ProjectPageUserParseFunction } from '../../queries';

//---CONFIG---
import { AppConfig } from '../../config';

//---STYLES---
import './style.scss';
import { projectReducer } from '../../reducers/ProjectsReducer';
import { DateRange } from 'react-date-range';
import { inputRanges, staticRanges } from '../ReportsPage/ranges';
import { de, enGB, it, ru, ua } from 'react-date-range/dist/locale';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';

import { getCurrentDate } from '../../services/timeService';
import { getCurrentTeamDetailedData, getProjectsList } from '../../configAPI';
const localeMap = {
    ru: ru,
    en: enGB,
    de: de,
    it: it,
    uk: ua,
};

class PlaningPage extends React.Component {
    state = {
        userData: null,
        timerPlaningList: null,

        showAddUser: false,
        showAddPlan: false,
        showTimeOff: false,
        showAddPlanTimeOff: false,

        dateSelect: false,
        selectionRange: {
            startDate: getCurrentDate(),
            endDate: getCurrentDate(),
            key: 'selection',
        },
    };

    async componentDidMount() {
        const { currentMonth, getTimerPlaningList, getProjects } = this.props;
        moment.locale(`${this.props.user.language}`);
        currentMonth();
        await this.getCurrentTeam();
        getTimerPlaningList();
        getProjects();
        this.getProjects();
    }

    getCurrentTeam = async () => {
        let res = await getCurrentTeamDetailedData();

        const teamUsers = res.data.data.team[0].team_users;
        const users = teamUsers.map(teamUser => teamUser.user[0]);
        const team = {
            id: res.data.data.team[0].id,
            name: res.data.data.team[0].name,
            users,
        };

        this.props.setCurrentTeam(team);
    };

    getProjects = () =>
        getProjectsList(true).then(
            result => {
                let data = getProjectsV2ProjectPageUserParseFunction(result.data.data);
                this.props.projectsPageAction('CREATE_PROJECT', { tableData: data.projectV2 });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );

    nextMonth = () => {
        this.props.nextMonth();
    };
    prevMonth = () => {
        this.props.prevMonth();
    };
    currentMonth = () => {
        this.props.currentMonth();
    };

    totalPlaned = () => {
        const { users } = this.props.planingReducer;
        return users
            .map(el =>
                el.shedule
                    .map(
                        item =>
                            item.projects && item.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed
                    )
                    .reduce((a, b) => a + b)
            )
            .reduce((a, b) => a + b);
    };
    totalTracked = () => {
        const { users } = this.props.planingReducer;
        return users
            .map(el =>
                el.shedule
                    .map(
                        item =>
                            item.projects &&
                            item.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked
                    )
                    .reduce((a, b) => a + b)
            )
            .reduce((a, b) => a + b);
    };

    changeUserOpenFlag = e => {
        this.props.changeUserOpenFlag(e.target.id);
    };

    changeAddUserFlag = () => {
        this.setState({ showAddUser: true });
    };
    changeAddPlanFlag = () => {
        this.setState({ showAddPlan: true });
    };
    changeAddTimeOffFlag = () => {
        this.setState({ showTimeOff: true });
    };
    changeAddPlanTimeOffFlag = () => {
        this.setState({ showAddPlanTimeOff: true });
    };

    closeAllFlags = e => {
        this.setState({
            showAddUser: false,
            showAddPlan: false,
            showTimeOff: false,
            showAddPlanTimeOff: false,
        });
    };

    openCalendar() {
        this.setState({ dateSelect: !this.state.dateSelect });
        document.addEventListener('click', this.closeDropdown);
    }

    closeDropdown = e => {
        if (this.datePickerSelect && !this.datePickerSelect.contains(e.target)) {
            this.setState(
                {
                    dateSelect: !this.state.dateSelect,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdown);
                }
            );
        }
    };

    handleSelect = ranges => {
        this.setState({ selectionRange: ranges.selection });
        // this.props.reportsPageAction('SET_TIME', { data: ranges.selection });
        // this.applySearch(this.getYear(ranges.selection.startDate), this.getYear(ranges.selection.endDate));
    };

    handleAddUser = (dataSelected, searchFlag) => {
        const { setSelectedUsers, getTimerPlaningList } = this.props;
        if (!searchFlag) {
            let selectedUsers = new Map();
            dataSelected.forEach(item =>
                item.team.team_users.forEach(user => {
                    let _user = user.user[0];
                    selectedUsers.set(_user.id, _user);
                })
            );
            dataSelected = Array.from(selectedUsers.values());
        }

        setSelectedUsers(dataSelected);
        getTimerPlaningList();
    };

    handleDeleteUser = userId => {
        const { deleteUser, getTimerPlaningList } = this.props;
        deleteUser(userId);
        getTimerPlaningList();
    };

    render() {
        const {
            planingReducer,
            vocabulary,
            addUser,
            projectsArray,
            changeTimeOffFlag,
            changeAllTimeOff,
            openDayOffChangeWindow,

            firstDayOfWeek,
            dateFormat,
        } = this.props;
        const {
            month,
            current,
            users,
            timeOff,
            swithcAllTimeOff,
            timerPlaningList,
            selectedUsers,
            currentTeam,
            projects,
        } = planingReducer;
        const { showAddUser, showAddPlan, showTimeOff, showAddPlanTimeOff } = this.state;
        const {
            v_resource_planing,
            v_all_projects,
            v_tracked,
            v_hour_small,
            v_next_month,
            v_prev_month,
            v_current_month,
            v_week,
            v_add_plan,
            v_time_off,
            v_filter,

            v_summary_report,
            v_total,
            v_export,
            v_today,
            v_yesterday,
            v_thisWeek,
            v_lastWeek,
            v_thisMonth,
            v_lastMonth,
            v_this_year,
            v_days_up_to_today,
            v_days_starting_today,
            lang,
        } = vocabulary;

        const customLocale = localeMap[lang.short];
        customLocale.options.weekStartsOn = firstDayOfWeek;
        return (
            <>
                <Scrollbars>
                    <div style={{ display: 'flex', minWidth: '100%', minHeight: '100%', overflowX: 'hidden' }}>
                        <div className="planing">
                            <div className="planing-header-container">
                                <div className="aside-bar">
                                    <div className="aside-bar__users">
                                        <div className="aside-bar__add-user-block" onClick={this.changeAddUserFlag}>
                                            <i className="aside-bar__add-user" />
                                            {showAddUser ? (
                                                <AddUserProject
                                                    cancel={this.closeAllFlags}
                                                    onAddPress={this.handleAddUser}
                                                    users={currentTeam.users}
                                                    projects={projects}
                                                    vocabulary={vocabulary}
                                                />
                                            ) : null}
                                        </div>
                                        {/*{selectedUsers.map(user => (*/}
                                        {/*    <div key={user.id} className="aside-bar__user-info">*/}
                                        {/*        <div*/}
                                        {/*            className="aside-bar__avatar-block"*/}
                                        {/*            style={{*/}
                                        {/*                // height: user.openFlag ? `${user.heightMulti * 60 + 30}px` : '60px',*/}
                                        {/*                height: 100,*/}
                                        {/*            }}*/}
                                        {/*        >*/}
                                        {/*            <div className="aside-bar__avatar">*/}
                                        {/*                <img  alt="oops no img"/>*/}
                                        {/*                <i/>*/}
                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*        <div className="aside-bar__show-btn">*/}
                                        {/*            <i*/}
                                        {/*                id={user.id}*/}
                                        {/*                onClick={this.changeUserOpenFlag}*/}
                                        {/*                className={user.openFlag ? 'arrow_up' : 'arrow_down'}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*))}*/}
                                    </div>
                                </div>
                                <div className="planing-header">
                                    <p>{v_resource_planing}</p>
                                    <div className="planing-header__info-container">
                                        <div className="planing-header__counters">
                                            <p>{`${'TOT_PLANNING'}${v_hour_small} ${v_all_projects} `}</p>
                                            <p>{`${'TOT_TRACKED'}${v_hour_small} ${v_tracked}`}</p>
                                        </div>
                                        <div className="planing-header__add-btn">
                                            <button onClick={this.changeAddTimeOffFlag}>{v_filter}</button>
                                            <button
                                                style={{ display: 'flex', alignItems: 'center' }}
                                                onClick={this.changeAddPlanFlag}
                                            >
                                                {' '}
                                                <i className="planing-header__plus" />
                                                {v_add_plan}
                                            </button>

                                            <button onClick={this.changeAddPlanFlag}>{v_time_off}</button>
                                        </div>

                                        <div className="planing-header__move-btn">
                                            <button onClick={this.prevMonth}>{v_prev_month}</button>
                                            <div className="selects_container">
                                                <div className="select_header" onClick={e => this.openCalendar()}>
                                                    <span>
                                                        {/*{moment(this.props.timeRange.startDate).format(dateFormat)} {' - '}*/}
                                                        {/*{moment(this.props.timeRange.endDate).format(dateFormat)}*/}
                                                        Month
                                                    </span>
                                                    <i className="arrow_down" />
                                                </div>
                                                {this.state.dateSelect && (
                                                    <div
                                                        className="select_body"
                                                        ref={div => (this.datePickerSelect = div)}
                                                    >
                                                        <DateRange
                                                            locale={customLocale}
                                                            dateDisplayFormat={dateFormat}
                                                            ranges={[
                                                                {
                                                                    startDate: this.state.selectionRange.startDate,
                                                                    endDate: this.state.selectionRange.endDate,
                                                                    key: 'selection',
                                                                },
                                                            ]}
                                                            // staticRanges={staticRanges(
                                                            //   v_today,
                                                            //   v_yesterday,
                                                            //   v_thisWeek,
                                                            //   v_lastWeek,
                                                            //   v_thisMonth,
                                                            //   v_lastMonth,
                                                            //   v_this_year,
                                                            //   firstDayOfWeek
                                                            // )}
                                                            inputRanges={inputRanges(
                                                                v_days_up_to_today,
                                                                v_days_starting_today,
                                                                firstDayOfWeek
                                                            )}
                                                            onChange={this.handleSelect}
                                                            moveRangeOnFirstSelection={true}
                                                            editableDateInputs={true}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {/*<button onClick={this.currentMonth}>{v_current_month}</button>*/}
                                            <button onClick={this.nextMonth}>{v_next_month}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* {-------BODY---------} */}
                            <Scrollbars>
                                <div className="main-content-wrapper">
                                    <div className="month-container">
                                        <div className="aside-bar">
                                            <div className="aside-bar__users" />
                                        </div>
                                        <div className="month-container__weeks-block">
                                            {month.map((week, index) => (
                                                <div className="month-container__week" key={index}>
                                                    <h2 style={{ whiteSpace: 'nowrap', color: week.weekColor }}>
                                                        {`${v_week} ${week.weekCount} / ${moment(current).format(
                                                            'MMM'
                                                        )} ${week.dayStart} - ${week.dayEnd}`}
                                                    </h2>
                                                    <div className="month-container__days-block">
                                                        {week.week.map((day, index) => (
                                                            <div className="month-container__day" key={index}>
                                                                <div
                                                                    style={{
                                                                        fontSize: '1em',
                                                                        whiteSpace: 'nowrap',
                                                                        textAlign: 'center',
                                                                        color: day.color,
                                                                    }}
                                                                >
                                                                    {moment(day.fullDate).format('ddd DD')}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {timerPlaningList
                                        ? timerPlaningList.map(user => (
                                              <PlaningUserBlock
                                                  key={user.id}
                                                  month={month}
                                                  user={user}
                                                  addUser={addUser}
                                                  {...vocabulary}
                                                  changeAddPlanFlag={this.changeAddPlanFlag}
                                                  onDeleteUser={this.handleDeleteUser}
                                              />
                                          ))
                                        : null}
                                    <div className="aside-bar-stub" />
                                    {/*{users.map(user => (*/}
                                    {/*    <PlaningUserBlock*/}
                                    {/*        key={user.id}*/}
                                    {/*        month={month}*/}
                                    {/*        user={user}*/}
                                    {/*        addUser={addUser}*/}
                                    {/*        {...vocabulary}*/}
                                    {/*        changeAddPlanFlag={this.changeAddPlanFlag}*/}
                                    {/*    />*/}
                                    {/*))}*/}
                                </div>
                            </Scrollbars>
                        </div>
                    </div>
                </Scrollbars>
                {showAddPlan || showTimeOff || showAddPlanTimeOff || showAddUser ? (
                    <ModalPortal>
                        <div>
                            {showAddPlan ? (
                                <AddPlan
                                    cancel={this.closeAllFlags}
                                    add={console.log}
                                    users={timerPlaningList}
                                    projects={projectsArray}
                                    vocabulary={vocabulary}
                                    getTimerPlaningList={this.getTimerPlaningList}
                                />
                            ) : null}
                            {showTimeOff ? (
                                <AddTimeOff
                                    cancel={this.closeAllFlags}
                                    add={console.log}
                                    change={changeTimeOffFlag}
                                    changeAll={changeAllTimeOff}
                                    timeOff={timeOff}
                                    vocabulary={vocabulary}
                                    allFlag={swithcAllTimeOff}
                                    openDayOffChangeWindow={openDayOffChangeWindow}
                                />
                            ) : null}
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'black',
                                    opacity: '0.7',
                                    zIndex: '19',
                                }}
                            />
                        </div>
                    </ModalPortal>
                ) : null}
            </>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    planingReducer: state.planingReducer,
    vocabulary: state.languageReducer.vocabulary,
    projectsArray: state.projectReducer.tableData,

    firstDayOfWeek: state.userReducer.firstDayOfWeek,
    dateFormat: state.userReducer.dateFormat,
    ///
    selectedUsers: state.planingReducer.selectedUsers,
});

const mapDispatchToProps = {
    createMonthArray,
    nextMonth,
    prevMonth,
    currentMonth,
    addUser,
    changeUserOpenFlag,
    projectsPageAction,
    changeTimeOffFlag,
    changeAllTimeOff,
    openDayOffChangeWindow,
    ///
    setSelectedUsers,
    getTimerPlaningList,
    setCurrentTeam,
    deleteUser,
    getProjects,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaningPage);
