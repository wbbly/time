import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './style.scss';

const OpendBlock = ({ date, index, v_hour_small, v_plan }) => {
    return (
        <div key={index}>
            <div
                style={{
                    position: 'absolute',
                    left: '5px',
                    top: '15px',
                    margin: 'auto',
                    padding: '0 10px',
                    width: '190px',
                    height: '30px',
                    background: '#474747',
                    display: 'flex',
                    zIndex: '1',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold' }}>{v_plan}</p>
                    <p
                        style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold' }}
                    >{`${date.planedTotal()} ${v_hour_small}`}</p>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        left: '0',
                        top: `calc(100% + 15px)`,
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    {date.projects.map((project, index) => (
                        <div
                            key={index}
                            style={{
                                left: '10px',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: project.color,
                                height: '30px',
                                marginBottom: '15px',
                                padding: '0 10px',
                                zIndex: '1',
                            }}
                        >
                            <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold' }}>{project.name}</p>
                            <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold' }}>{`${
                                project.planed
                            } ${v_hour_small}`}</p>
                            <div
                                style={{
                                    position: 'absolute',
                                    background: project.color,
                                    width: '15px',
                                    height: '15px',
                                    top: '7.5px',
                                    left: '-7.5px',
                                    margin: 'auto',
                                    borderRadius: '50%',
                                    border: '3px solid #323232',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ClosedBlock = ({ date, index, v_hour_small, v_plan }) => {
    return (
        <div key={index}>
            <div
                style={{
                    position: 'absolute',
                    left: '5px',
                    top: '15px',
                    margin: 'auto',
                    width: '190px',
                    height: '30px',
                    display: 'flex',
                    zIndex: '1',
                }}
            >
                <div style={{ display: 'flex', flex: 3, position: 'relative' }}>
                    <div
                        style={{
                            width: '100%',
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 5px',
                        }}
                    >
                        <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold' }}>{v_plan}</p>
                        <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold' }}>
                            {date.planedTotal()}
                            {v_hour_small}
                        </p>
                    </div>
                    {date.projects.map((project, index) => (
                        <div key={index} style={{ flex: '1', background: project.color }} />
                    ))}
                </div>
                {date.timeOff.length ? (
                    <div style={{ display: 'flex', flex: 1 }}>
                        {date.timeOff.map((off, index) => (
                            <div key={index} style={{ flex: '1', background: off.color }} />
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const PlaningUserBlock = ({ month, user, v_hour_small, v_plan }) => {
    const [openFlag, setOpenFlag] = useState(false);
    const [longestArray, setLongestArray] = useState(1);

    useEffect(
        () => {
            user.shedule.map(el => (el.projects.length > longestArray ? setLongestArray(el.projects.length) : null));
        },
        [month]
    );

    const changeFlag = () => {
        setOpenFlag(!openFlag);
    };
    console.log(user);
    return (
        <div className="user-block">
            <div className="user-block__user-info">
                <div
                    className="user-block__avatar-block"
                    style={{
                        height: openFlag ? `calc(${longestArray * 60 + 61}px)` : '60px',
                    }}
                >
                    <div className="user-block__avatar">
                        {' '}
                        <img src={user.avatar} alt="oops no img" />
                        <i />
                    </div>
                </div>
                <div
                    className="user-block__show-btn"
                    style={{ minWidth: '20px', height: '20px', marginLeft: '10px', cursor: 'pointer' }}
                    onClick={changeFlag}
                >
                    <i className={openFlag ? 'arrow_up' : 'arrow_down'} />
                </div>
            </div>
            <div className="user-block__main-block" style={{ display: 'flex', borderBottom: '1px solid #1F1F1F' }}>
                {month.map((week, index) => (
                    <div key={index} style={{ display: 'flex', margin: '0 10px 0 10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div
                                id={`week_${week.week[0].fullDate}`}
                                style={{
                                    display: 'flex',
                                    position: 'relative',
                                    height: openFlag ? `calc(${longestArray * 60 + 60}px)` : '59px',
                                }}
                            >
                                {week.week.map((day, index) => (
                                    <div
                                        key={index}
                                        id={`middle_${day.fullDate}`}
                                        style={{
                                            width: '40px',
                                            height: '100%',
                                            border: '1px solid #1F1F1F',
                                            borderTop: 'none',
                                            borderBottom: 'none',
                                            background: day.background,
                                            opacity: day.opacity,
                                        }}
                                    />
                                ))}
                                {user.shedule.map(
                                    (date, index) =>
                                        week.week.find(el =>
                                            moment(date.dateStart).isSame(moment(el.fullDate), 'day')
                                        ) ? (
                                            openFlag ? (
                                                <OpendBlock
                                                    index={index}
                                                    date={date}
                                                    v_plan={v_plan}
                                                    v_hour_small={v_hour_small}
                                                />
                                            ) : (
                                                <ClosedBlock
                                                    index={index}
                                                    date={date}
                                                    v_hour_small={v_hour_small}
                                                    v_plan={v_plan}
                                                />
                                            )
                                        ) : null
                                )}
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
        </div>
    );
};

export default PlaningUserBlock;
