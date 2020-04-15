import React, { useState, useRef, useEffect } from 'react';
import AddUserProject from '../../../../components/PlaningAddUserProject';

import { de, enGB, it, ru, ua } from 'react-date-range/dist/locale';

import '../../style.scss';

const localeMap = {
    ru: ru,
    en: enGB,
    de: de,
    it: it,
    uk: ua,
};

export const PlanningHeader = props => {
    const {
        showAddUser,
        changeAddUserFlag,
        vocabulary,
        cancel,
        onAddPress,
        users,
        projects,
        firstDayOfWeek,
        changeAddTimeOffFlag,
        changeAddPlanFlag,
        changeTimeOffShow,
        prevMonth,
        nextMonth,
        changeWeekOrMonth,
        isWeek,
    } = props;

    const { v_next_month, v_prev_month, v_add_plan, v_time_off, v_filter, lang } = vocabulary;

    const customLocale = localeMap[lang.short];
    customLocale.options.weekStartsOn = firstDayOfWeek;

    const datePickerSelect = useRef();

    const [dateSelect, setDataSelect] = useState(false);

    const closeDropdown = e => {
        if (datePickerSelect.current.contains(e.target)) {
            return;
        }

        setDataSelect(false);
    };

    useEffect(
        () => {
            if (dateSelect) {
                document.addEventListener('mousedown', closeDropdown);
            } else {
                document.removeEventListener('mousedown', closeDropdown);
            }
            return () => {
                document.removeEventListener('mousedown', closeDropdown);
            };
        },
        [dateSelect]
    );
    const clickMonth = () => {
        if (isWeek) changeWeekOrMonth();
        setDataSelect(!dateSelect);
    };
    const clickWeek = () => {
        if (!isWeek) changeWeekOrMonth();
        setDataSelect(!dateSelect);
    };

    return (
        <div className="planing-header-container">
            <div className="aside-bar">
                <div className="aside-bar__users">
                    <div className="aside-bar__add-user-block" onClick={changeAddUserFlag}>
                        <i className="aside-bar__add-user" />
                        {showAddUser ? (
                            <AddUserProject
                                cancel={cancel}
                                onAddPress={onAddPress}
                                users={users.users}
                                projects={projects}
                                vocabulary={vocabulary}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="planing-header">
                <div className="planing-header__info-container">
                    <div className="planing-header__add-btn">
                        <button onClick={changeAddTimeOffFlag}>{v_filter}</button>
                        <button style={{ display: 'flex', alignItems: 'center' }} onClick={changeAddPlanFlag}>
                            {' '}
                            <i className="planing-header__plus" />
                            {v_add_plan}
                        </button>

                        <button onClick={changeTimeOffShow}>{v_time_off}</button>
                    </div>

                    <div className="planing-header__move-btn">
                        <button onClick={prevMonth}>{isWeek ? 'Previous week' : v_prev_month}</button>
                        <div ref={datePickerSelect} className="selects_container">
                            <div className="select_header" onClick={() => setDataSelect(!dateSelect)}>
                                <span>{isWeek ? 'Week' : 'Month'}</span>
                                <i className="arrow_down" />
                            </div>
                            {dateSelect && (
                                <div className="select_body">
                                    <div onClick={clickMonth}>Month</div>
                                    <div onClick={clickWeek}>Week</div>
                                </div>
                            )}
                        </div>
                        <button onClick={nextMonth}>{isWeek ? 'Next week' : v_next_month}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
