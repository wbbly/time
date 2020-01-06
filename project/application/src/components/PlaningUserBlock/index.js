import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './style.scss';
import { prepareDataForValidation } from 'formik';

const Accordion = ({ openFlag }) => {
    return (
        <div
            {...{
                className: `accordion-item, ${openFlag && 'accordion-item--opened'}`,
            }}
        >
            <div {...{ className: 'accordion-item__line' }}>
                <h3 {...{ className: 'accordion-item__title' }}>{'Hello'}</h3>
                <span {...{ className: 'accordion-item__icon' }} />
            </div>
            <div {...{ className: 'accordion-item__inner' }}>
                <div {...{ className: 'accordion-item__content' }}>
                    <p {...{ className: 'accordion-item__paragraph' }}>{'Test'}</p>
                </div>
            </div>
        </div>
    );
};

const PlaningUserBlock = ({ month, user }) => {
    const [openFlag, setOpenFlag] = useState(false);
    const [longestArray, setLongestArray] = useState(1);

    useEffect(
        () => {
            user.shedule.forEach(
                el => (el.projects.length > longestArray ? setLongestArray(el.projects.length) : null)
            );
        },
        [month]
    );

    const changeFlag = () => {
        setOpenFlag(!openFlag);
    };

    return (
        <div className="user-block" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="user-block__avatar" style={{ minWidth: '55px', height: '55px', background: 'red' }} />
            <button
                className="user-block__show-btn"
                style={{ minWidth: '20px', height: '20px', background: 'green' }}
                onClick={changeFlag}
            />
            <div className="user-block__main-block" style={{ display: 'flex' }}>
                {month.map((week, index) => (
                    <div key={index} style={{ display: 'flex', margin: '0 10px 0 10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div
                                id={`week_${week.week[0].fullDate}`}
                                style={{
                                    display: 'flex',
                                    position: 'relative',
                                    height: openFlag ? `calc(${(longestArray + 1) * 60}px)` : '60px',
                                    transition: 'height 0.5s',
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
                                    date =>
                                        week.week.find(el =>
                                            moment(date.dateStart).isSame(moment(el.fullDate), 'day')
                                        ) ? (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: '10px',
                                                    top: '10px',
                                                    margin: 'auto',
                                                    padding: '0 10px',
                                                    width: 'calc(100% - 100px)',
                                                    height: '30px',
                                                    background: 'orange',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <p style={{ height: '100%' }}>Planed</p>
                                                <p style={{ height: '100%' }}>{date.planedTotal()}h</p>
                                            </div>
                                        ) : null
                                )}
                            </div>
                            <div style={{ display: 'flex', position: 'relative' }}>
                                {week.week.map((day, index) => (
                                    <div
                                        //fake line with add button
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
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaningUserBlock;
