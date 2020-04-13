import React, { useState, useRef, useEffect } from 'react';
import AddUserProject from '../../../../components/PlaningAddUserProject';
import { DateRange } from 'react-date-range';
import { inputRanges } from '../../../ReportsPage/ranges';

import { de, enGB, it, ru, ua } from 'react-date-range/dist/locale';

import moment from 'moment';
import '../../style.scss';

const localeMap = {
    ru: ru,
    en: enGB,
    de: de,
    it: it,
    uk: ua,
};

export const PlanningHeader = props => {
    const [selectionRange, setSelection] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const {
        showAddUser,
        changeAddUserFlag,
        vocabulary,
        cancel,
        onAddPress,
        users,
        projects,
        firstDayOfWeek,
        dateFormat,
        changeAddTimeOffFlag,
        changeAddPlanFlag,
        changeTimeOffShow,
        prevMonth,
        nextMonth,
    } = props;

    const {
        v_next_month,
        v_prev_month,
        v_add_plan,
        v_time_off,
        v_filter,
        v_days_up_to_today,
        v_days_starting_today,
        lang,
    } = vocabulary;

    const customLocale = localeMap[lang.short];
    customLocale.options.weekStartsOn = firstDayOfWeek;

    const handleSelect = ranges => {
        var startOfWeek = moment(ranges.selection.startDate)
            .startOf('week')
            .weekday(1)
            .format('YYYY-MM-DD');
        var endOfWeek = moment(ranges.selection.startDate)
            .endOf('week')
            .weekday(7)
            .format('YYYY-MM-DD');

        setSelection({
            startDate: moment(startOfWeek).toDate(),
            endDate: moment(endOfWeek).toDate(),
            key: 'selection',
        });
    };
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
                        <button onClick={prevMonth}>{v_prev_month}</button>
                        <div ref={datePickerSelect} className="selects_container">
                            <div className="select_header" onClick={e => setDataSelect(!dateSelect)}>
                                <span>Month</span>
                                <i className="arrow_down" />
                            </div>
                            {dateSelect && (
                                <div className="select_body">
                                    <DateRange
                                        locale={customLocale}
                                        dateDisplayFormat={dateFormat}
                                        ranges={[
                                            {
                                                startDate: selectionRange.startDate,
                                                endDate: selectionRange.endDate,
                                                key: 'selection',
                                            },
                                        ]}
                                        inputRanges={inputRanges(
                                            v_days_up_to_today,
                                            v_days_starting_today,
                                            firstDayOfWeek
                                        )}
                                        onChange={handleSelect}
                                        moveRangeOnFirstSelection={false}
                                        editableDateInputs={false}
                                    />
                                </div>
                            )}
                        </div>
                        <button onClick={nextMonth}>{v_next_month}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
