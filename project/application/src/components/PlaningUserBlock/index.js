import React, { useEffect, useState } from 'react';
import moment from 'moment';

import plusPlan from '../../images/plusPlan.svg';
import noAvatar from '../../images/icon-512x512.png';

import './style.scss';

const PlanBlock = ({ date, v_hour_small, widthPlan, project, changeAddPlanFlag, setCurrentPlan, user }) => {
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
                width: true ? `${Math.floor(widthPlan + 1) * 40 - 2}px` : `${Math.floor(widthPlan + 1) * 160 - 2}px`,
            }}
            className="plan-block"
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

const TimeOffBlock = ({ date, widthPlan, project, changeTimeOffShow, setCurrentPlan, user }) => {
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
                width: true ? `${Math.floor(widthPlan + 1) * 40 - 2}px` : `${Math.floor(widthPlan + 1) * 160 - 2}px`,
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

const AddPlun = ({ changeAddPlanFlag }) => {
    return (
        <div>
            <img className="plus-img" onClick={changeAddPlanFlag} src={plusPlan} />
        </div>
    );
};

const LoggedBlock = ({ log, v_hour_small, entry, logIndex }) => {
    return (
        <div
            className="logged-block"
            style={{
                width: true ? 38 : 160,
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
                            className={true ? 'cell' : 'cell-isWeek'}
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
    v_hour_small,
    v_plan,
    addUser,
    changeAddPlanFlag,
    changeTimeOffShow,
    onDeleteUser,
    setCurrentData,
    deletePlan,
    setCurrentPlan,
    currentPlanOrTimeOff,
}) => {
    const clickData = ({ user, userId, fullDate, dataProject }) => {
        setOpen({ fullDate: fullDate, project_id: dataProject.project_id });
        setCurrentData({
            user: { username: user.username, id: user.id },
            fullDate,
            project: { project_id: dataProject.project_id, projectName: dataProject.project.name },
        });
    };

    const [dataClick, setOpen] = useState({ fullDate: false, project_id: false });

    const durSum = () => {
        let durationSum = 0;
        user.timer_plannings.forEach(timer_planning =>
            timer_planning.projects.forEach(project => (durationSum += project.duration))
        );
        return durationSum;
    };

    return (
        <div key={user.id} className="user-block">
            <div className="aside-bar">
                <div className="aside-bar__users">
                    <div className="aside-bar__avatar">
                        <img src={user.avatar ? user.avatar : noAvatar} alt="no img" />
                        <i onClick={() => onDeleteUser(user.id)} />
                    </div>
                </div>
            </div>
            <div>
                <p className="plan__title">Plan /{durSum()}h</p>
                <div className="user-block__main-block">
                    <div>
                        {user.timer_plannings.map(
                            (date, index) =>
                                ((user.timer_plannings.length === 1 && !date.project) || !!date.projects.length) && (
                                    <div key={date.project_id} className="user-block__month-block">
                                        {month.map((week, index) => (
                                            <div
                                                key={index}
                                                className="user-block__week-block"
                                                id={`week_${week.week[0].fullDate}`}
                                            >
                                                {week.week.map((day, index) => {
                                                    return (
                                                        !day.opacity && (
                                                            <div
                                                                className="user-block__day-block"
                                                                key={index}
                                                                id={`middle_${day.fullDate}`}
                                                                style={{
                                                                    background: day.background,
                                                                    opacity: day.opacity,
                                                                    width: false ? 160 : 40,
                                                                }}
                                                                onClick={() =>
                                                                    clickData({
                                                                        user,
                                                                        userId: date.id,
                                                                        fullDate: day.fullDate,
                                                                        dataProject: date,
                                                                    })
                                                                }
                                                                tabIndex={1}
                                                                onBlur={() =>
                                                                    setOpen({
                                                                        fullDate: null,
                                                                        project_id: null,
                                                                    })
                                                                }
                                                            >
                                                                {!Object.keys(currentPlanOrTimeOff).length &&
                                                                    day.fullDate === dataClick.fullDate &&
                                                                    date.project_id === dataClick.project_id && (
                                                                        <AddPlun
                                                                            changeAddPlanFlag={changeAddPlanFlag}
                                                                        />
                                                                    )}
                                                                {date.projects.map((project, index) => {
                                                                    return moment(project.start_date).format('L') ===
                                                                        moment(day.fullDate).format('L') &&
                                                                        week.week.find(el => {
                                                                            return (
                                                                                moment(project.start_date).format(
                                                                                    'L'
                                                                                ) === moment(el.fullDate).format('L')
                                                                            );
                                                                        }) ? (
                                                                        <PlanBlock
                                                                            key={project.id}
                                                                            date={date}
                                                                            widthPlan={
                                                                                (new Date(project.end_date) -
                                                                                    new Date(project.start_date)) /
                                                                                (1000 * 60 * 60 * 24)
                                                                            }
                                                                            v_plan={v_plan}
                                                                            v_hour_small={v_hour_small}
                                                                            project={project}
                                                                            deletePlan={deletePlan}
                                                                            changeAddPlanFlag={changeAddPlanFlag}
                                                                            setCurrentPlan={setCurrentPlan}
                                                                            user={user}
                                                                        />
                                                                    ) : null;
                                                                })}
                                                                {user.timer_plannings.map(
                                                                    (date, index) =>
                                                                        (!date.project || !date.projects.length) &&
                                                                        date.timeOff.map(
                                                                            timeOff =>
                                                                                moment(timeOff.start_date).format(
                                                                                    'L'
                                                                                ) ===
                                                                                    moment(day.fullDate).format('L') &&
                                                                                week.week.find(el => {
                                                                                    return (
                                                                                        moment(
                                                                                            timeOff.start_date
                                                                                        ).format('L') ===
                                                                                        moment(el.fullDate).format('L')
                                                                                    );
                                                                                }) ? (
                                                                                    <TimeOffBlock
                                                                                        key={timeOff.id}
                                                                                        date={date}
                                                                                        widthPlan={
                                                                                            (new Date(
                                                                                                timeOff.end_date
                                                                                            ) -
                                                                                                new Date(
                                                                                                    timeOff.start_date
                                                                                                )) /
                                                                                            (1000 * 60 * 60 * 24)
                                                                                        }
                                                                                        v_plan={v_plan}
                                                                                        v_hour_small={v_hour_small}
                                                                                        project={timeOff}
                                                                                        changeTimeOffShow={
                                                                                            changeTimeOffShow
                                                                                        }
                                                                                        setCurrentPlan={setCurrentPlan}
                                                                                        user={user}
                                                                                    />
                                                                                ) : null
                                                                        )
                                                                )}
                                                            </div>
                                                        )
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                )
                        )}
                    </div>
                </div>
                {!!user.logged.length && (
                    <div className="logged">
                        <p className="logged__title">Logged</p>
                        <div className="user-block__main-block">
                            {month.map((week, index) => (
                                <div key={index}>
                                    <div
                                        id={`week_${week.week[0].fullDate}`}
                                        className="week"
                                        style={{ height: 60 * user.logged.length }}
                                    >
                                        {week.week.map((day, index) => {
                                            return (
                                                !day.opacity && (
                                                    <div
                                                        key={index}
                                                        id={`middle_logged_${day.fullDate}`}
                                                        className={true ? 'day' : 'day-isWeek'}
                                                        style={{
                                                            background: day.background,
                                                            opacity: day.opacity,
                                                        }}
                                                        tabIndex={1}
                                                    >
                                                        {user.logged.map((log, logIndex) =>
                                                            log.timeGroups.map(
                                                                (entry, entryIndex) =>
                                                                    moment(entry.formattedDate).format('L') ===
                                                                        moment(day.fullDate).format('L') &&
                                                                    week.week.find(el => {
                                                                        return (
                                                                            moment(entry.formattedDate).format('L') ===
                                                                            moment(el.fullDate).format('L')
                                                                        );
                                                                    }) ? (
                                                                        <LoggedBlock
                                                                            key={index}
                                                                            logIndex={logIndex}
                                                                            log={log}
                                                                            entry={entry}
                                                                            v_hour_small={v_hour_small}
                                                                        />
                                                                    ) : null
                                                            )
                                                        )}
                                                    </div>
                                                )
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaningUserBlock;
