import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

//---COMPONENTS---
import ModalPortal from '../../components/ModalPortal';

import { AddPlan } from '../../components/PlaningAddPlan';
import { AddTimeOff } from '../../components/PlaningAddTimeOff';

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
    getTime_Off,
    setTimeOff,
    setCurrentTeam,
    deleteUser,
    getProjects,
    setCurrentData,
    setCurrentPlan,
    deletePlan,
    patchPlan,
    changeUserSelected,
} from '../../actions/PlaningActions';
import projectsPageAction from '../../actions/ProjectsActions';

//---STYLES---
import './style.scss';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';

import { getCurrentDate } from '../../services/timeService';

import { getCurrentTeamDetailedData } from '../../configAPI';
import { PlanningHeader } from './components/PlanningHeader';
import { PlanningBody } from './components/PlanningBody';

class PlaningPage extends React.Component {
    state = {
        userData: null,
        timerPlaningList: null,
        showAddUser: false,
        showAddPlan: false,
        showTimeOff: false,
        showAddPlanTimeOff: false,
        timeOffShow: false,
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
    }

    getCurrentTeam = async () => {
        const { setSelectedUsers, setCurrentTeam } = this.props;

        let res = await getCurrentTeamDetailedData();

        const teamUsers = res.data.data.team[0].team_users;
        const users = teamUsers.map(teamUser => teamUser.user[0]);
        const team = {
            id: res.data.data.team[0].id,
            name: res.data.data.team[0].name,
            users,
        };

        setSelectedUsers(users);

        setCurrentTeam(team);
    };

    nextMonth = () => {
        this.props.nextMonth();
    };
    prevMonth = () => {
        this.props.prevMonth();
    };
    currentMonth = () => {
        this.props.currentMonth();
    };

    changeUserOpenFlag = e => {
        this.props.changeUserOpenFlag(e.target.id);
    };

    changeAddUserFlag = () => {
        this.setState({ showAddUser: true });
    };
    changeAddPlanFlag = () => {
        this.setState({ showAddPlan: true, timeOffShow: false });
    };
    changeTimeOffShow = () => {
        this.setState({ showAddPlan: true, timeOffShow: true });
    };

    changeAddTimeOffFlag = () => {
        this.setState({ showTimeOff: true });
    };

    closeAllFlags = e => {
        const { planingReducer } = this.props;
        const { currentPlanOrTimeOff, dataClickAddPlan } = planingReducer;

        if (Object.keys(dataClickAddPlan).length) {
            this.props.setCurrentData({});
        }

        if (Object.keys(currentPlanOrTimeOff).length) {
            this.props.setCurrentPlan({});
        }

        this.setState({
            showAddUser: false,
            showAddPlan: false,
            showTimeOff: false,
            showAddPlanTimeOff: false,
        });
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
            changeTimeOffFlag,
            changeAllTimeOff,
            openDayOffChangeWindow,
            firstDayOfWeek,
            dateFormat,
            getTimerPlaningList,
            getTime_Off,
            setCurrentData,
            deletePlan,
            patchPlan,
            setCurrentPlan,
            setTimeOff,
            changeUserSelected,
        } = this.props;

        const {
            month,
            current,
            timeOff,
            swithcAllTimeOff,
            timerPlaningList,
            newtimeOff,
            currentTeam,
            projects,
            dataClickAddPlan,
            currentPlanOrTimeOff,
            userSelected,
        } = planingReducer;

        const { showAddUser, showAddPlan, showTimeOff, showAddPlanTimeOff, timeOffShow } = this.state;

        return (
            <>
                <div className="planing">
                    <PlanningHeader
                        showAddUser={showAddUser}
                        changeAddUserFlag={this.changeAddUserFlag}
                        vocabulary={vocabulary}
                        cancel={this.closeAllFlags}
                        onAddPress={this.handleAddUser}
                        users={currentTeam}
                        projects={projects}
                        firstDayOfWeek={firstDayOfWeek}
                        dateFormat={dateFormat}
                        changeAddTimeOffFlag={this.changeAddTimeOffFlag}
                        changeAddPlanFlag={this.changeAddPlanFlag}
                        changeTimeOffShow={this.changeTimeOffShow}
                        prevMonth={this.prevMonth}
                        nextMonth={this.nextMonth}
                    />
                    {/* {-------BODY---------} */}
                    <PlanningBody
                        month={month}
                        vocabulary={vocabulary}
                        timerPlaningList={timerPlaningList}
                        current={current}
                        setCurrentData={setCurrentData}
                        addUser={addUser}
                        changeAddPlanFlag={this.changeAddPlanFlag}
                        changeTimeOffShow={this.changeTimeOffShow}
                        onDeleteUser={this.handleDeleteUser}
                        deletePlan={deletePlan}
                        setCurrentPlan={setCurrentPlan}
                        currentPlanOrTimeOff={currentPlanOrTimeOff}
                    />
                </div>
                {showAddPlan || showTimeOff || showAddPlanTimeOff || showAddUser ? (
                    <ModalPortal>
                        <div className="modal-add_plan">
                            {showAddPlan ? (
                                <AddPlan
                                    cancel={this.closeAllFlags}
                                    timeOff={newtimeOff}
                                    users={timerPlaningList}
                                    projects={projects}
                                    vocabulary={vocabulary}
                                    getTimerPlaningList={getTimerPlaningList}
                                    getTimeOff={getTime_Off}
                                    timeOffShow={timeOffShow}
                                    dataClickAddPlan={dataClickAddPlan}
                                    patchPlan={patchPlan}
                                    deletePlan={deletePlan}
                                    currentPlanOrTimeOff={currentPlanOrTimeOff}
                                />
                            ) : null}
                            {showTimeOff ? (
                                <AddTimeOff
                                    cancel={this.closeAllFlags}
                                    change={changeTimeOffFlag}
                                    changeAll={changeAllTimeOff}
                                    timeOff={timeOff}
                                    vocabulary={vocabulary}
                                    allFlag={swithcAllTimeOff}
                                    openDayOffChangeWindow={openDayOffChangeWindow}
                                    getTimeOff={getTime_Off}
                                    newtimeOff={newtimeOff}
                                    setTimeOff={setTimeOff}
                                    getTimerPlaningList={getTimerPlaningList}
                                    changeUserSelected={changeUserSelected}
                                    userSelected={userSelected}
                                />
                            ) : null}
                            <div className="bg-modal" />
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
    setSelectedUsers,
    getTimerPlaningList,
    getTime_Off,
    setTimeOff,
    setCurrentTeam,
    deleteUser,
    getProjects,
    setCurrentData,
    deletePlan,
    patchPlan,
    setCurrentPlan,
    changeUserSelected,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaningPage);
