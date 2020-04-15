import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import { PlanBlock, TimeOffBlock } from '../../PlaningUserBlock';
import { setCurrentData, setCurrentPlan } from '../../../actions/PlaningActions';

import plusPlan from '../../../images/plusPlan.svg';

import '../../PlaningUserBlock/style.scss';

const AddPlun = ({ changeAddPlanFlag }) => {
    return (
        <div>
            <img className="plus-img" onClick={changeAddPlanFlag} src={plusPlan} />
        </div>
    );
};

const Plan = ({
    user,
    weekCount,
    planingReducer,
    setCurrentData,
    changeAddPlanFlag,
    setCurrentPlan,
    changeTimeOffShow,
    vocabulary,
}) => {
    const { isWeek, month, currentPlanOrTimeOff } = planingReducer;
    const { v_hour_small, v_plan } = vocabulary;

    const clickData = ({ user, fullDate, dataProject }) => {
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

    const differenceDays = (startDate, endDate) => {
        return (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    };

    return (
        <div className="plan">
            <p className="plan__title">Plan /{durSum()}h</p>
            <div className="user-block__main-block">
                <div>
                    {user.timer_plannings.map(
                        (date, index) =>
                            ((user.timer_plannings.length === 1 && !date.project) || !!date.projects.length) && (
                                <div key={date.project_id} className="user-block__month-block">
                                    {month.map(
                                        (week, index) =>
                                            ((index === weekCount && isWeek) || !isWeek) && (
                                                <div
                                                    key={index}
                                                    className="user-block__week-block"
                                                    id={`week_${week.week[0].fullDate}`}
                                                >
                                                    {week.week.map((day, index) => {
                                                        return (
                                                            !day.opacity && (
                                                                <div
                                                                    className={classNames('user-block__day-block', {
                                                                        'user-block__day-block--isWeek': isWeek,
                                                                    })}
                                                                    key={index}
                                                                    id={`middle_${day.fullDate}`}
                                                                    style={{
                                                                        background: day.background,
                                                                        opacity: day.opacity,
                                                                    }}
                                                                    onClick={() =>
                                                                        clickData({
                                                                            user,
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
                                                                        return moment(project.start_date).format(
                                                                            'L'
                                                                        ) === moment(day.fullDate).format('L') ? (
                                                                            <PlanBlock
                                                                                key={project.id}
                                                                                widthPlan={differenceDays(
                                                                                    project.start_date,
                                                                                    project.end_date
                                                                                )}
                                                                                v_plan={v_plan}
                                                                                v_hour_small={v_hour_small}
                                                                                project={project}
                                                                                changeAddPlanFlag={changeAddPlanFlag}
                                                                                setCurrentPlan={setCurrentPlan}
                                                                                user={user}
                                                                                isWeek={isWeek}
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
                                                                                    moment(day.fullDate).format('L') ? (
                                                                                        <TimeOffBlock
                                                                                            key={timeOff.id}
                                                                                            widthPlan={differenceDays(
                                                                                                timeOff.start_date,
                                                                                                timeOff.end_date
                                                                                            )}
                                                                                            v_plan={v_plan}
                                                                                            v_hour_small={v_hour_small}
                                                                                            project={timeOff}
                                                                                            changeTimeOffShow={
                                                                                                changeTimeOffShow
                                                                                            }
                                                                                            setCurrentPlan={
                                                                                                setCurrentPlan
                                                                                            }
                                                                                            user={user}
                                                                                            isWeek={isWeek}
                                                                                        />
                                                                                    ) : null
                                                                            )
                                                                    )}
                                                                </div>
                                                            )
                                                        );
                                                    })}
                                                </div>
                                            )
                                    )}
                                </div>
                            )
                    )}
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    setCurrentData,
    setCurrentPlan,
};

const mapStateToProps = state => ({
    planingReducer: state.planingReducer,
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Plan);
