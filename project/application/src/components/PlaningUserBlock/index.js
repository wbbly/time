import React from 'react';

import noAvatar from '../../images/icon-512x512.png';

import './style.scss';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Logged from '../Planing/Logged';
import Plan from '../Planing/Plan';
import { deleteUser, getTimerPlaningList } from '../../actions/PlaningActions';

export const PlanBlock = ({
    date,
    v_hour_small,
    widthPlan,
    project,
    changeAddPlanFlag,
    setCurrentPlan,
    user,
    isWeek,
}) => {
    const clickPlan = () => {
        changeAddPlanFlag();

        setCurrentPlan({
            id: project.id,
            userId: user.id,
            username: user.username,
            projectName: project.name,
            projectId: project.project_id,
            duration: project.duration,
            startDate: project.start_date,
            endDate: project.end_date,
        });
    };

    return (
        <div
            onClick={clickPlan}
            style={{
                width: isWeek ? `${Math.floor(widthPlan + 1) * 160 - 2}px` : `${Math.floor(widthPlan + 1) * 40 - 2}px`,
            }}
            className={classNames('plan-block')}
        >
            <div className="plan-container">
                <div
                    style={{
                        background: project.project_color.name,
                    }}
                    className="plan"
                >
                    <p>{project.name}</p>
                    <p>{`${project.duration}${v_hour_small}`}</p>
                </div>
            </div>
        </div>
    );
};

export const TimeOffBlock = ({ date, widthPlan, project, changeTimeOffShow, setCurrentPlan, user, isWeek }) => {
    const clickOpen = () => {
        changeTimeOffShow();

        setCurrentPlan({
            id: project.id,
            userId: user.id,
            username: user.username,
            projectName: project.title,
            projectId: project.project_id,
            duration: project.duration,
            startDate: project.start_date,
            endDate: project.end_date,
        });
    };

    return (
        <div
            onClick={clickOpen}
            style={{
                width: isWeek ? `${Math.floor(widthPlan + 1) * 160 - 2}px` : `${Math.floor(widthPlan + 1) * 40 - 2}px`,
            }}
            className="time-off-block"
        >
            <div className="time-off-container">
                <div
                    style={{
                        background: project.time_off_color,
                    }}
                    className="time-off"
                >
                    <p>{project.title}</p>
                </div>
            </div>
        </div>
    );
};

export const LoggedBlock = ({ log, v_hour_small, entry, logIndex, isWeek }) => {
    return (
        <div
            className={classNames('logged-block', {
                'logged-block-isWeek': isWeek,
            })}
            style={{
                top: 60 * logIndex,
            }}
        >
            <div className="container">
                <p className="project-title">
                    {log.name} / {`${entry.totalTime}${v_hour_small}`}
                </p>
                <div className="cell-container">
                    {entry.days.map((day, i) => (
                        <div
                            key={`${day.formattedDate}_${day.projectId}_${i}`}
                            className={classNames('cell', {
                                'cell--isWeek': isWeek,
                            })}
                            style={{
                                background: log.project_color.name,
                            }}
                        >
                            <p className="day-hour">{`${day.totalTime}${v_hour_small}`}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PlaningUserBlock = ({
    month,
    user,
    changeAddPlanFlag,
    changeTimeOffShow,
    weekCount,
    getTimerPlaningList,
    deleteUser,
}) => {
    const handleDeleteUser = userId => {
        deleteUser(userId);
        getTimerPlaningList();
    };

    return (
        <div key={user.id} className="user-block">
            <div className="aside-bar">
                <div className="aside-bar__users">
                    <div title={user.username} className="aside-bar__avatar">
                        <img src={user.avatar ? user.avatar : noAvatar} alt="no img" />
                        <i onClick={() => handleDeleteUser(user.id)} />
                    </div>
                </div>
            </div>
            <div>
                <Plan
                    user={user}
                    weekCount={weekCount}
                    changeAddPlanFlag={changeAddPlanFlag}
                    changeTimeOffShow={changeTimeOffShow}
                />
                {!!user.logged.length && <Logged month={month} weekCount={weekCount} user={user} />}
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    deleteUser,
    getTimerPlaningList,
};

const mapStateToProps = state => ({
    planingReducer: state.planingReducer,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlaningUserBlock);
