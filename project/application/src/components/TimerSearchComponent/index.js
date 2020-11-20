import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { DateRangePicker } from 'react-date-range';
import { enGB, ru, de, it, ua } from 'react-date-range/src/locale';

import { inputRanges, staticRanges } from '../../pages/ReportsPage/ranges';
import { useOutsideClick } from '../../services/hookHelpers';

import SearchComponent from '../SearchComponent';

import './style.scss';
import { getTimeEntriesListAction, startSearchMode, endSearchMode } from '../../actions/MainPageAction';

const localeMap = {
    ru: ru,
    en: enGB,
    de: de,
    it: it,
    uk: ua,
};

const TimerSearchComponent = ({
    vocabulary,
    firstDayOfWeek,
    dateFormat,
    startSearchMode,
    getTimeEntriesListAction,
    endSearchMode,
    isSearchMode,
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [showCallendar, setShowCallendar] = useState(false);
    const [selectionRange, setSelectionRange] = useState({
        startDate: moment().startOf('month'),
        endDate: moment().endOf('month'),
        key: 'selection',
    });

    useEffect(() => {
        return () => {
            endSearchMode();
        };
    }, []);

    // useEffect(() => {
    //     if(!searchValue){
    //         setSelectionRange({
    //             startDate: moment().startOf('month'),
    //             endDate: moment().endOf('month'),
    //             key: 'selection',
    //         });
    //         endSearchMode();
    //         getTimeEntriesListAction();
    //     }
    // }, [searchValue])
    const {
        v_today,
        v_yesterday,
        v_thisWeek,
        v_lastWeek,
        v_thisMonth,
        v_lastMonth,
        v_this_year,
        v_days_up_to_today,
        v_days_starting_today,
        lang,
        v_reset,
    } = vocabulary;

    const customLocale = localeMap[lang.short];
    customLocale.options.weekStartsOn = firstDayOfWeek;

    const wrapperRef = useRef(null);
    useOutsideClick(wrapperRef, () => setShowCallendar(false));

    const handleSearch = async () => {
        startSearchMode({
            searchValue,
            searchDateRange: {
                startDateTime: moment(selectionRange.startDate)
                    .utc()
                    .toISOString(),
                endDateTime: moment(selectionRange.endDate)
                    .add(1, 'day')
                    .utc()
                    .toISOString(),
            },
        });
        await getTimeEntriesListAction();
    };

    const handleSelect = async ranges => {
        setSelectionRange(ranges.selection);
        startSearchMode({
            searchValue,
            searchDateRange: {
                startDateTime: moment(ranges.selection.startDate)
                    .utc()
                    .toISOString(),
                endDateTime: moment(ranges.selection.endDate)
                    .add(1, 'day')
                    .utc()
                    .toISOString(),
            },
        });
        await getTimeEntriesListAction();
    };

    const handleReset = async () => {
        if (!isSearchMode) {
            return;
        }
        setSearchValue('');
        setSelectionRange({
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month'),
            key: 'selection',
        });
        endSearchMode();
        await getTimeEntriesListAction();
    };

    return (
        <div className="timer-search">
            <div className="timer-search__search-input">
                <SearchComponent
                    value={searchValue}
                    setValue={setSearchValue}
                    handleReset={handleReset}
                    handleSearch={handleSearch}
                />
            </div>
            <div className="timer-search__date-select" ref={wrapperRef}>
                <div className="timer-search__date-select-header" onClick={() => setShowCallendar(!showCallendar)}>
                    <span>
                        {moment(selectionRange.startDate).format(dateFormat)} {' - '}
                        {moment(selectionRange.endDate).format(dateFormat)}
                    </span>
                    <i className="timer-search__date-select-arrow-down" />
                </div>
                {showCallendar && (
                    <div
                        className="timer-search__date-select-body"
                        // ref={div => (this.datePickerSelect = div)}
                    >
                        <DateRangePicker
                            locale={customLocale}
                            dateDisplayFormat={dateFormat}
                            ranges={[
                                {
                                    startDate: selectionRange.startDate,
                                    endDate: selectionRange.endDate,
                                    key: 'selection',
                                },
                            ]}
                            staticRanges={staticRanges(
                                v_today,
                                v_yesterday,
                                v_thisWeek,
                                v_lastWeek,
                                v_thisMonth,
                                v_lastMonth,
                                v_this_year,
                                firstDayOfWeek
                            )}
                            inputRanges={inputRanges(v_days_up_to_today, v_days_starting_today, firstDayOfWeek)}
                            onChange={handleSelect}
                        />
                    </div>
                )}
                <button className="timer-search__reset-btn" onClick={() => handleReset()}>
                    {v_reset}
                </button>
            </div>
        </div>
    );
};

const mapStateToProps = store => ({
    vocabulary: store.languageReducer.vocabulary,
    firstDayOfWeek: store.userReducer.firstDayOfWeek,
    dateFormat: store.userReducer.dateFormat,
    isSearchMode: store.mainPageReducer.isSearchMode,
});
const mapDispatchToProps = {
    getTimeEntriesListAction,
    startSearchMode,
    endSearchMode,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimerSearchComponent);
