import React, {useEffect, useState} from 'react';
import moment from 'moment';

import plusPlan from '../../images/plusPlan.svg';

import './style.scss';

const OpendBlock = ({date, v_hour_small, v_plan, widthPlan}) => {
    console.log({date}, {widthPlan})
    return (
        <div>
            <div
                style={{
                    position: 'absolute',
                    top: '8px',
                    width: `${Math.floor(widthPlan + 1) * 40 - 2}px`,
                    zIndex: 1,
                    display: 'flex',
                }}
            >
                {date.project &&
                widthPlan < 3 && (
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <p style={{color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold', margin: 0}}>
                            {v_plan}
                        </p>
                        {/*<p*/}
                        {/*    style={{color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold', margin: 0}}*/}
                        {/*>{`${date.project && date.planedTotal()} ${v_hour_small}`}</p>*/}
                    </div>
                )}
                <div
                    style={{
                        position: 'absolute',
                        left: '0',
                        top: `calc(100% + 8px)`,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    {/*{date.project &&*/}
                    {/*// date.project.map((project, index) => (*/}
                        <div
                            // key={index}
                            style={{
                                // left: '10px',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: date.project.project_color.name,
                                height: '30px',
                                marginBottom: '15px',
                                padding: '0 10px',
                            }}
                        >
                            <p style={{color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold'}}>{date.project.name}</p>
                            <p style={{color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold'}}>{`${
                                date.duration
                            } ${v_hour_small}`}</p>
                            {/*<div*/}
                            {/*    style={{*/}
                            {/*        position: 'absolute',*/}
                            {/*        background: project.color,*/}
                            {/*        width: '15px',*/}
                            {/*        height: '15px',*/}
                            {/*        top: '7.5px',*/}
                            {/*        left: '-7.5px',*/}
                            {/*        margin: 'auto',*/}
                            {/*        borderRadius: '50%',*/}
                            {/*        border: '3px solid #323232',*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </div>
                    {/*))}*/}
                    {date.timer_off && date.timer_off.map((timeOff, index) => (
                        <div
                            key={index}
                            style={{
                                width: 40,
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                background: timeOff.color,
                                height: '30px',
                                // marginBottom: '15px',
                                padding: '0 1px',
                            }}
                        >
                            <p style={{color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold'}}>{timeOff.name}</p>
                            {/*<div*/}
                            {/*    style={{*/}
                            {/*        position: 'absolute',*/}
                            {/*        background: timeOff.color,*/}
                            {/*        width: '15px',*/}
                            {/*        height: '15px',*/}
                            {/*        top: '7.5px',*/}
                            {/*        left: '-7.5px',*/}
                            {/*        margin: 'auto',*/}
                            {/*        borderRadius: '50%',*/}
                            {/*        border: '3px solid #323232',*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ClosedBlock = ({date, v_hour_small, v_plan, widthPlan}) => {
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
                    <div style={{display: 'flex', flex: 3, position: 'relative'}}>
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
                            <p style={{color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold', margin: 0}}>
                                {v_plan}
                            </p>
                            <p style={{color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold', margin: 0}}>
                                {date.planedTotal()}
                                {v_hour_small}
                            </p>
                        </div>
                        {date.projects.map((project, index) => (
                            <div key={index} style={{flex: '1', background: project.color}}/>
                        ))}
                    </div>
                )}
                {!date.timeOff.every(off => off.checked === false) ? (
                    <div style={{display: 'flex', flex: 1, transition: 'flex 0.5s'}}>
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

const AddPlun = ({changeAddPlanFlag}) => {
    // if(!open){
    //     return null
    // }
    return (
        <div>
            <img
                onClick={changeAddPlanFlag}
                style={{width: 38, height: 22, zIndex: 12, position: 'absolute', top: '8px'}}
                src={plusPlan}
            />
        </div>
    );
};

const LoggedBlock = ({log, v_hour_small, entry, logIndex,}) => {

    return (
        <div
            className="logged-block"
            style={{
                width: 38,
                top: 60 * logIndex,
            }}
        >
            <div className="container">
                <p className="project-title">{log.name} / {`${entry.totalTime}${v_hour_small}`}</p>
                <div className="cell-container">
                    {entry.days.map((day, i) => (
                        <div
                            key={day}
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

const PlaningUserBlock = ({month, user, v_hour_small, v_plan, addUser, changeAddPlanFlag}) => {
    useEffect(
        () => {
            addUser();
        },
        [user]
    );
    const [dataClick, setOpen] = useState(false);

    return (
        <div className="user-block">
            <div
                className="user-block__main-block"
                style={{display: 'flex', borderBottom: '1px solid #1F1F1F', marginLeft: '-10px'}}
            >
                {month.map((week, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            // margin: '0 10px 0 10px'
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div
                                id={`week_${week.week[0].fullDate}`}
                                style={{
                                    display: 'flex',
                                    position: 'relative',
                                    // height: user.openFlag ? `${user.heightMulti * 60 + 30}px` : '60px',
                                    height: 200,
                                    transition: 'height 0.3s',
                                }}
                            >
                                {week.week.map((day, index) => {
                                    console.log({day});
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
                                                <AddPlun changeAddPlanFlag={changeAddPlanFlag}/>
                                            )}
                                            {user.timer_plannings.map(
                                                (date, index) =>
                                                    moment(date.start_date).format('L') ===
                                                    moment(day.fullDate).format('L') &&
                                                    week.week.find(el => {
                                                        return (
                                                            moment(date.start_date).format('L') ===
                                                            moment(el.fullDate).format('L')
                                                        );
                                                    }) ? (
                                                        user ? (
                                                            <>
                                                                <OpendBlock
                                                                    key={index}
                                                                    date={date}
                                                                    widthPlan={
                                                                        (new Date(date.end_date) -
                                                                            new Date(date.start_date)) /
                                                                        (1000 * 60 * 60 * 24)
                                                                    }
                                                                    v_plan={v_plan}
                                                                    v_hour_small={v_hour_small}
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
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {/*---fake line ---*/}
                            {/* <div style={{ display: 'flex', position: 'relative' }}>
                                {week.week.map((day, index) => (
                                    <div
                                        key={index}
                                        id={`bottom_${day.fullDate}`}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            border: '1px solid #1F1F1F',
                                            borderTop: 'none',
                                            borderBottom: 'none',
                                            background: day.background,
                                            opacity: day.opacity,
                                        }}
                                    />
                                ))}
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>
            {user.logged.length &&
            <div className="logged">
                <p className="logged__title">Logged</p>
                <div className="user-block__main-block">
                    {month.map((week, index) => (
                        <div key={index}>
                            <div id={`week_${week.week[0].fullDate}`} className="week"
                                 style={{height: 60 * user.logged.length}}>
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

                                                log.timeGroups.map((entry, entryIndex) =>

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
            }
        </div>
    );
};

export default PlaningUserBlock;
