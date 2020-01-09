import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './style.scss';

// const Accordion = ({ openFlag }) => {
//     return (
//         <div
//             {...{
//                 className: `accordion-item, ${openFlag && 'accordion-item--opened'}`,
//             }}
//         >
//             <div {...{ className: 'accordion-item__line' }}>
//                 <h3 {...{ className: 'accordion-item__title' }}>{'Hello'}</h3>
//                 <span {...{ className: 'accordion-item__icon' }} />
//             </div>
//             <div {...{ className: 'accordion-item__inner' }}>
//                 <div {...{ className: 'accordion-item__content' }}>
//                     <p {...{ className: 'accordion-item__paragraph' }}>{'Test'}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const OpendBlock = ({ date }) => {
//     return (
//         <div key={index}>
//             <div
//                 style={{
//                     position: 'absolute',
//                     left: '5px',
//                     top: '15px',
//                     margin: 'auto',
//                     padding: '0 10px',
//                     width: `calc(${date.daysCount() * 60 - 15}px)`,
//                     height: '30px',
//                     background: 'grey',
//                     display: 'flex',
//                     zIndex: '1',
//                 }}
//             >
//                 <div
//                     style={{
//                         display: 'flex',
//                         width: '100%',
//                         justifyContent: 'space-between',
//                     }}
//                 >
//                     <p style={{ height: '100%' }}>{v_plan}</p>
//                     <p style={{ height: '100%' }}>{`${date.planedTotal()} ${v_hour_small}`}</p>
//                 </div>
//                 <div
//                     style={{
//                         position: 'absolute',
//                         left: '0',
//                         top: `calc(100% + 15px)`,
//                         width: '80%',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         justifyContent: 'flex-start',
//                     }}
//                 >
//                     {date.projects.map((project, index) => (
//                         <div
//                             key={index}
//                             style={{
//                                 left: '10px',
//                                 position: 'relative',
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 background: project.color,
//                                 height: '30px',
//                                 marginBottom: '15px',
//                                 padding: '0 10px',
//                                 zIndex: '1',
//                             }}
//                         >
//                             <p style={{ height: '100%' }}>{project.name}</p>
//                             <p style={{ height: '100%' }}>{`${project.planed} ${v_hour_small}`}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
const ClosedBlock = ({ date, index }) => {
    return (
        <div key={index}>
            <div
                style={{
                    position: 'absolute',
                    left: '5px',
                    top: '15px',
                    margin: 'auto',
                    padding: '0 10px',
                    // width: `calc(${date.daysCount() * 40 - 15}px)`,
                    width: '200px',
                    height: '30px',
                    // background: 'grey',
                    display: 'flex',
                    zIndex: '1',
                }}
            >
                {/* <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    <p style={{ height: '100%' }}>{v_plan}</p>
                    <p style={{ height: '100%' }}>{`${date.planedTotal()} ${v_hour_small}`}</p>
                </div> */}
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
                        <p>Plan</p>
                        <p>{date.planedTotal()}h</p>
                    </div>
                    {date.projects.map((project, index) => (
                        <div key={index} style={{ flex: '1', background: project.color }} />
                    ))}
                </div>
                <div style={{ display: 'flex', flex: 1 }}>
                    {date.timeOff.map((off, index) => (
                        <div key={index} style={{ flex: '1', background: off.color }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const PlaningUserBlock = ({
    month,
    user,
    // v_planning,
    // v_resource_planing,
    // v_all_projects,
    // v_tracked,
    // v_hour_small,
    // v_next_month,
    // v_prev_month,
    // v_week,
    // v_plan,
    // v_add_plan,
    // v_time_off,
    // v_add_time,
    // v_add_preson,
    // v_add,
    // V_cancel,
    // v_public_holiday,
}) => {
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
        <div className="user-block" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div className="user-block__user-info" style={{ display: 'flex' }}>
                <div
                    className="user-block__avatar"
                    style={{
                        minWidth: '55px',
                        height: openFlag ? `calc(${longestArray * 60 + 30}px)` : '60px',
                        transition: 'height 0.3s',
                        background: '#3b3b3b',
                        borderLeft: '3px solid #1F1F1F',
                    }}
                />
                <button
                    className="user-block__show-btn"
                    style={{ minWidth: '20px', height: '20px', background: 'green' }}
                    onClick={changeFlag}
                />
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
                                    height: openFlag ? `calc(${longestArray * 59 + 30}px)` : '59px',
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
                                            openFlag ? null : (
                                                <ClosedBlock index={index} date={date} />
                                            )
                                        ) : // <div key={index}>
                                        //     <div
                                        //         style={{
                                        //             position: 'absolute',
                                        //             left: '5px',
                                        //             top: '15px',
                                        //             margin: 'auto',
                                        //             padding: '0 10px',
                                        //             width: 'calc(100% - 90px)',
                                        //             height: '30px',
                                        //             background: 'grey',
                                        //             display: 'flex',
                                        //             zIndex: '1',
                                        //         }}
                                        //     >
                                        //         <div
                                        //             style={{
                                        //                 display: 'flex',
                                        //                 width: '100%',
                                        //                 justifyContent: 'space-between',
                                        //             }}
                                        //         >
                                        //             <p style={{ height: '100%' }}>{v_plan}</p>
                                        //             <p
                                        //                 style={{ height: '100%' }}
                                        //             >{`${date.planedTotal()} ${v_hour_small}`}</p>
                                        //         </div>
                                        //         <div
                                        //             style={{
                                        //                 position: 'absolute',
                                        //                 left: '0',
                                        //                 top: `calc(100% + 15px)`,
                                        //                 width: '80%',
                                        //                 display: 'flex',
                                        //                 flexDirection: 'column',
                                        //                 justifyContent: 'flex-start',
                                        //             }}
                                        //         >
                                        //             {openFlag &&
                                        //                 date.projects.map((project, index) => (
                                        //                     <div
                                        //                         key={index}
                                        //                         style={{
                                        //                             left: '10px',
                                        //                             position: 'relative',
                                        //                             display: 'flex',
                                        //                             justifyContent: 'space-between',
                                        //                             background: project.color,
                                        //                             height: '30px',
                                        //                             marginBottom: '15px',
                                        //                             padding: '0 10px',
                                        //                             zIndex: '1',
                                        //                         }}
                                        //                     >
                                        //                         <p style={{ height: '100%' }}>{project.name}</p>
                                        //                         <p style={{ height: '100%' }}>{`${
                                        //                             project.planed
                                        //                         } ${v_hour_small}`}</p>
                                        //                     </div>
                                        //                 ))}
                                        //         </div>
                                        //     </div>
                                        // </div>
                                        null
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
