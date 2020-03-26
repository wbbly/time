import React, { useEffect, useState } from 'react';
import moment from 'moment';

import plusPlan from '../../images/plusPlan.svg';
import noAvatar from '../../images/icon-512x512.png';

import './style.scss';

const OpendBlock = ({ date, v_hour_small, widthPlan, indexHeight, project }) => {
    return (
        <div
            style={{
                top: 38 * indexHeight,
                width: `${Math.floor(widthPlan + 1) * 40 - 2}px`,
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

const OpendBlockTimeOff = ({ date, widthPlan, indexHeight, project }) => {
    return (
        <div
            style={{
                top: 38 * indexHeight,
                width: `${Math.floor(widthPlan + 1) * 40 - 2}px`,
            }}
            className="plan-block"
        >
            <div className="plan-container">
                <div
                    style={{
                        background: project.time_off_color,
                    }}
                    className="plan"
                >
                    <p>{project.title}</p>
                </div>
            </div>
        </div>
    );
};

const ClosedBlock = ({ date, v_hour_small, v_plan, widthPlan }) => {
    const strech = (e, timeOff) => {
        e.target.style.flex = 10;
        e.target.parentNode.style.flex = 10;
        e.target.innerText = timeOff.name;
    };
    const shrink = (e, timeOff) => {
        e.target.style.flex = 1;
        e.target.parentNode.style.flex = 1;
        e.target.innerText = timeOff.name.slice(0, 1);
    };

    return (
        <div>
            <div
                style={{
                    position: 'absolute',
                    // left: '5px',
                    top: '8px',
                    margin: 'auto',
                    width: `${Math.floor(widthPlan + 1) * 40 - 2}px`,
                    height: '22px',
                    zIndex: 1,
                    display: 'flex',
                }}
            >
                {date.projects && (
                    <div style={{ display: 'flex', flex: 3, position: 'relative' }}>
                        <div
                            style={{
                                height: '100%',
                                width: '100%',
                                position: 'absolute',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0 10px',
                            }}
                        >
                            <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold', margin: 0 }}>
                                {v_plan}
                            </p>
                            <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold', margin: 0 }}>
                                {date.planedTotal()}
                                {v_hour_small}
                            </p>
                        </div>
                        {date.projects.map((project, index) => (
                            <div key={index} style={{ flex: '1', background: project.color }} />
                        ))}
                    </div>
                )}
                {!date.timeOff.every(off => off.checked === false) ? (
                    <div style={{ display: 'flex', flex: 1, transition: 'flex 0.5s' }}>
                        {date.timeOff.map(
                            (timeOff, index) =>
                                timeOff.checked ? (
                                    <div
                                        onMouseOver={e => strech(e, timeOff)}
                                        onMouseOut={e => shrink(e, timeOff)}
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: '1',
                                            background: timeOff.color,
                                            color: '#FFFFFF',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.5s',
                                        }}
                                    >
                                        {timeOff.name.slice(0, 1)}
                                    </div>
                                ) : null
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const AddPlun = ({ changeAddPlanFlag }) => {
    return (
        <div>
            <img
                onClick={changeAddPlanFlag}
                style={{ width: 38, height: 22, zIndex: 12, position: 'absolute', top: '8px' }}
                src={plusPlan}
            />
        </div>
    );
};

const LoggedBlock = ({ log, v_hour_small, entry, logIndex }) => {
    return (
        <div
            className="logged-block"
            style={{
                width: 38,
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
                            className="cell"
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

const PlaningUserBlock = ({ month, user, v_hour_small, v_plan, addUser, changeAddPlanFlag, onDeleteUser }) => {
    useEffect(
        () => {
            addUser();
        },
        [user]
    );

    const [dataClick, setOpen] = useState(false);

    const durSum = () => {
        let durationSum = 0;
        user.timer_plannings.forEach(timer_planning =>
            timer_planning.projects.forEach(project => (durationSum += project.duration))
        );
        return durationSum;
    };

    return (
        <div className="user-block">
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
                    {month.map((week, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div
                                    id={`week_${week.week[0].fullDate}`}
                                    style={{
                                        display: 'flex',
                                        position: 'relative',
                                        height: 47 * user.timer_plannings.length,
                                        transition: 'height 0.3s',
                                    }}
                                >
                                    {week.week.map((day, index) => {
                                        return (
                                            <div
                                                key={index}
                                                id={`middle_${day.fullDate}`}
                                                style={{
                                                    width: '40px',
                                                    height: '100%',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    border: '1px solid #1F1F1F',
                                                    borderTop: 'none',
                                                    borderBottom: 'none',
                                                    background: day.background,
                                                    opacity: day.opacity,
                                                    outline: 'none',
                                                }}
                                                onClick={() => setOpen(day.fullDate)}
                                                tabIndex={1}
                                                onBlur={() => setOpen(null)}
                                            >
                                                {day.fullDate === dataClick && (
                                                    <AddPlun changeAddPlanFlag={changeAddPlanFlag} />
                                                )}

                                                {user.timer_plannings.map((date, index) =>
                                                    date.projects.map(
                                                        project =>
                                                            moment(project.start_date).format('L') ===
                                                                moment(day.fullDate).format('L') &&
                                                            week.week.find(el => {
                                                                return (
                                                                    moment(project.start_date).format('L') ===
                                                                    moment(el.fullDate).format('L')
                                                                );
                                                            }) ? (
                                                                user ? (
                                                                    <>
                                                                        <OpendBlock
                                                                            key={index}
                                                                            date={date}
                                                                            widthPlan={
                                                                                (new Date(project.end_date) -
                                                                                    new Date(project.start_date)) /
                                                                                (1000 * 60 * 60 * 24)
                                                                            }
                                                                            v_plan={v_plan}
                                                                            v_hour_small={v_hour_small}
                                                                            indexHeight={index}
                                                                            project={project}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <ClosedBlock
                                                                        key={index}
                                                                        date={date}
                                                                        widthPlan={
                                                                            (new Date(date.dateEnd) -
                                                                                new Date(date.dateStart)) /
                                                                            (1000 * 60 * 60 * 24)
                                                                        }
                                                                        v_hour_small={v_hour_small}
                                                                        v_plan={v_plan}
                                                                    />
                                                                )
                                                            ) : null
                                                    )
                                                )}
                                                {user.timer_plannings.map(
                                                    (date, index) =>
                                                        ((user.timer_plannings.length === 1 && !date.project) ||
                                                            !!date.projects.length) &&
                                                        date.timeOff.map(
                                                            timeOff =>
                                                                moment(timeOff.start_date).format('L') ===
                                                                    moment(day.fullDate).format('L') &&
                                                                week.week.find(el => {
                                                                    return (
                                                                        moment(timeOff.start_date).format('L') ===
                                                                        moment(el.fullDate).format('L')
                                                                    );
                                                                }) ? (
                                                                    <>
                                                                        <OpendBlockTimeOff
                                                                            key={index}
                                                                            date={date}
                                                                            widthPlan={
                                                                                (new Date(timeOff.end_date) -
                                                                                    new Date(timeOff.start_date)) /
                                                                                (1000 * 60 * 60 * 24)
                                                                            }
                                                                            v_plan={v_plan}
                                                                            v_hour_small={v_hour_small}
                                                                            indexHeight={index}
                                                                            project={timeOff}
                                                                        />
                                                                    </>
                                                                ) : null
                                                        )
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
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
                                                <div
                                                    key={index}
                                                    id={`middle_logged_${day.fullDate}`}
                                                    className="day"
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
                                                                    <>
                                                                        <LoggedBlock
                                                                            key={index}
                                                                            logIndex={logIndex}
                                                                            log={log}
                                                                            entry={entry}
                                                                            v_hour_small={v_hour_small}
                                                                        />
                                                                    </>
                                                                ) : null
                                                        )
                                                    )}
                                                </div>
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
