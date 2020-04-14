import React from 'react';
import moment from 'moment';
import PlaningUserBlock from '../../../../components/PlaningUserBlock';

import '../../style.scss';
import classNames from 'classnames';

export const PlanningBody = props => {
    const {
        month,
        vocabulary,
        timerPlaningList,
        current,
        setCurrentData,
        addUser,
        changeAddPlanFlag,
        changeTimeOffShow,
        onDeleteUser,
        deletePlan,
        currentPlanOrTimeOff,
        setCurrentPlan,
        isWeek,
        weekCount,
    } = props;

    const { v_week } = vocabulary;

    const opacitySum = week => {
        let opacitySum = 0;
        week.week.forEach(item => {
            if (item.opacity) opacitySum += +item.opacity;
        });
        return opacitySum;
    };

    return (
        <div className="main-content-wrapper">
            <div className="month-container">
                <div className="aside-bar">
                    <div className="aside-bar__users" />
                </div>
                <div className="month-container__weeks-block">
                    {month.map((week, index) => {
                        return (
                            ((index === weekCount && isWeek) || !isWeek) && (
                                <div className="month-container__week" key={index}>
                                    <h2
                                        style={{
                                            display: opacitySum(week) > 0.9 && !isWeek ? 'none' : 'inherit',
                                            whiteSpace: 'nowrap',
                                            color: week.weekColor,
                                        }}
                                    >
                                        {`${v_week} ${week.weekCount} / ${moment(current).format('MMM')} ${
                                            week.dayStart
                                        } - ${week.dayEnd}`}
                                    </h2>
                                    <div className="month-container__days-block">
                                        {week.week.map((day, index) => {
                                            return (
                                                !day.opacity && (
                                                    <div
                                                        style={{ color: day.color }}
                                                        className={classNames('month-container__day', {
                                                            'month-container__day-isWeek': isWeek,
                                                        })}
                                                        key={index}
                                                    >
                                                        {moment(day.fullDate).format('ddd DD')}
                                                    </div>
                                                )
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
            {timerPlaningList
                ? timerPlaningList.map(user => (
                      <PlaningUserBlock
                          setCurrentData={setCurrentData}
                          key={user.id}
                          month={month}
                          user={user}
                          addUser={addUser}
                          {...vocabulary}
                          changeAddPlanFlag={changeAddPlanFlag}
                          changeTimeOffShow={changeTimeOffShow}
                          onDeleteUser={onDeleteUser}
                          deletePlan={deletePlan}
                          setCurrentPlan={setCurrentPlan}
                          currentPlanOrTimeOff={currentPlanOrTimeOff}
                          weekCount={weekCount}
                      />
                  ))
                : null}
            <div className="aside-bar-stub" />
        </div>
    );
};
