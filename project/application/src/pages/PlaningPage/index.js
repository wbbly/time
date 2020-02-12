import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

//---COMPONENTS---
import ModalPortal from '../../components/ModalPortal';
import PlaningUserBlock from '../../components/PlaningUserBlock';
import { AddUserProject } from '../../components/PlaningAddUserProject';
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
} from '../../actions/PlaningActions';
import projectsPageAction from '../../actions/ProjectsActions';

// Queries
import { getProjectsV2ProjectPageUserParseFunction } from '../../queries';

//---CONFIG---
import { AppConfig } from '../../config';

//---STYLES---
import './style.scss';
import { projectReducer } from '../../reducers/ProjectsReducer';

class PlaningPage extends React.Component {
    state = {
        showAddUser: false,
        showAddPlan: false,
        showTimeOff: false,
        showAddPlanTimeOff: false,
    };

    componentDidMount() {
        moment.locale(`${this.props.user.language}`);
        this.props.currentMonth();
        this.getProjects();
    }

    getProjects = () =>
        apiCall(AppConfig.apiURL + `project/list?withTimerList=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                let data = getProjectsV2ProjectPageUserParseFunction(result.data);
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
                    .map(item => item.projects.reduce((a, b) => ({ planed: a.planed + b.planed })).planed)
                    .reduce((a, b) => a + b)
            )
            .reduce((a, b) => a + b);
    };
    totalTracked = () => {
        const { users } = this.props.planingReducer;
        return users
            .map(el =>
                el.shedule
                    .map(item => item.projects.reduce((a, b) => ({ tracked: a.tracked + b.tracked })).tracked)
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

    render() {
        const { planingReducer, vocabulary, addUser, projectsArray, changeTimeOffFlag, changeAllTimeOff } = this.props;
        const { month, current, users, timeOff, swithcAllTimeOff } = planingReducer;
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
        } = vocabulary;
        return (
            <>
                <Scrollbars>
                    <div style={{ display: 'flex', minWidth: '100%', minHeight: '100%', overflowX: 'hidden' }}>
                        <div className="aside-bar">
                            <div className="aside-bar__users">
                                <div className="aside-bar__filler-top" />
                                <div className="aside-bar__add-user-block" onClick={this.changeAddUserFlag}>
                                    <i className="aside-bar__add-user" />
                                    {showAddUser ? (
                                        <AddUserProject
                                            cancel={this.closeAllFlags}
                                            add={console.log} //change to needed function when backend will be done
                                            users={users}
                                            projects={projectsArray}
                                            vocabulary={vocabulary}
                                        />
                                    ) : null}
                                </div>
                                {users.map(user => (
                                    <div key={user.id} className="aside-bar__user-info">
                                        <div
                                            className="aside-bar__avatar-block"
                                            style={{
                                                height: user.openFlag ? `${user.heightMulti * 60 + 30}px` : '60px',
                                            }}
                                        >
                                            <div className="aside-bar__avatar">
                                                <img src={user.avatar} alt="oops no img" />
                                                <i />
                                            </div>
                                        </div>
                                        <div className="aside-bar__show-btn">
                                            <i
                                                id={user.id}
                                                onClick={this.changeUserOpenFlag}
                                                className={user.openFlag ? 'arrow_up' : 'arrow_down'}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="planing">
                            <div className="planing-header">
                                <p>{v_resource_planing}</p>
                                <div className="planing-header__info-container">
                                    <div className="planing-header__counters">
                                        <p>{`${this.totalPlaned()}${v_hour_small} ${v_all_projects} `}</p>
                                        <p>{`${this.totalTracked()}${v_hour_small} ${v_tracked}`}</p>
                                    </div>
                                    <div className="planing-header__add-btn">
                                        <button
                                            style={{ display: 'flex', alignItems: 'center' }}
                                            onClick={this.changeAddPlanFlag}
                                        >
                                            {' '}
                                            <i className="planing-header__plus" />
                                            {v_add_plan}
                                        </button>

                                        <button onClick={this.changeAddTimeOffFlag}>{v_time_off}</button>
                                    </div>
                                    <div className="planing-header__move-btn">
                                        <button onClick={this.prevMonth}>{v_prev_month}</button>
                                        <button onClick={this.currentMonth}>{v_current_month}</button>
                                        <button onClick={this.nextMonth}>{v_next_month}</button>
                                    </div>
                                </div>
                            </div>

                            {/* {-------BODY---------} */}
                            <Scrollbars>
                                <div className="main-content-wrapper">
                                    <div className="month-container">
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
                                    {users.map(user => (
                                        <PlaningUserBlock
                                            key={user.id}
                                            month={month}
                                            user={user}
                                            addUser={addUser}
                                            {...vocabulary}
                                        />
                                    ))}
                                </div>
                            </Scrollbars>
                        </div>
                    </div>
                </Scrollbars>
                {showAddPlan || showTimeOff || showAddPlanTimeOff ? (
                    <ModalPortal>
                        <div style={{ top: '0', left: '0', position: 'fixed', width: '100%', height: '100%' }}>
                            {showAddPlan ? (
                                <AddPlan
                                    cancel={this.closeAllFlags}
                                    add={console.log}
                                    users={users}
                                    projects={projectsArray}
                                    vocabulary={vocabulary}
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaningPage);
