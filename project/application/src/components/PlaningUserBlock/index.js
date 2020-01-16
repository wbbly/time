import React, { useEffect } from 'react';
import moment from 'moment';
import './style.scss';

const OpendBlock = ({ date, v_hour_small, v_plan }) => {
    return (
        <div>
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
                    {date.timeOff.map((timeOff, index) => (
                        <div
                            key={index}
                            style={{
                                left: '10px',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: timeOff.color,
                                height: '30px',
                                marginBottom: '15px',
                                padding: '0 10px',
                            }}
                        >
                            <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 'bold' }}>{timeOff.name}</p>
                            <div
                                style={{
                                    position: 'absolute',
                                    background: timeOff.color,
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

const ClosedBlock = ({ date, v_hour_small, v_plan }) => {
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
                    left: '5px',
                    top: '15px',
                    margin: 'auto',
                    width: '190px',
                    height: '30px',
                    display: 'flex',
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

const PlaningUserBlock = ({ month, user, v_hour_small, v_plan, addUser }) => {
    useEffect(
        () => {
            addUser();
        },
        [user]
    );
    return (
        <div className="user-block">
            <div
                className="user-block__main-block"
                style={{ display: 'flex', borderBottom: '1px solid #1F1F1F', marginLeft: '-10px' }}
            >
                {month.map((week, index) => (
                    <div key={index} style={{ display: 'flex', margin: '0 10px 0 10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div
                                id={`week_${week.week[0].fullDate}`}
                                style={{
                                    display: 'flex',
                                    position: 'relative',
                                    height: user.openFlag ? `${user.heightMulti * 60 + 30}px` : '60px',
                                    transition: 'height 0.3s',
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
                                            user.openFlag ? (
                                                <OpendBlock
                                                    key={index}
                                                    date={date}
                                                    v_plan={v_plan}
                                                    v_hour_small={v_hour_small}
                                                />
                                            ) : (
                                                <ClosedBlock
                                                    key={index}
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
