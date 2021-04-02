import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { DateRangePicker } from 'react-date-range';
import { enGB, ru, de, it, ua } from 'react-date-range/src/locale';
import InputMask from 'react-input-mask';
import axios from 'axios';

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
    const [startDateValue, setStartDateValue] = useState(moment(moment().startOf('month')).format(dateFormat));
    const [endDateValue, setEndDateValue] = useState(moment(moment().endOf('month')).format(dateFormat));

    useEffect(() => {
        return () => {
            endSearchMode();
        };
    }, []);

    // const endSearch = useCallback(() => {
    //     endSearchMode()
    // }, [endSearchMode])

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
        v_last_year,
        v_days_up_to_today,
        v_days_starting_today,
        lang,
        v_reset,
    } = vocabulary;

    const customLocale = localeMap[lang.short];
    customLocale.options.weekStartsOn = firstDayOfWeek;

    const wrapperRef = useRef(null);
    const abort = useRef(null);
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
        if (abort.current) {
            abort.current.cancel();
        }
        const CancelToken = axios.CancelToken;
        abort.current = CancelToken.source();
        setSelectionRange(ranges.selection);
        setStartDateValue(moment(ranges.selection.startDate).format(dateFormat));
        setEndDateValue(moment(ranges.selection.endDate).format(dateFormat));
        startSearchMode({
            searchValue,
            searchDateRange: {
                startDateTime: moment(ranges.selection.startDate)
                    .utc()
                    .toISOString(),
                endDateTime: moment(ranges.selection.endDate)
                    .endOf('day')
                    .utc()
                    .toISOString(),
            },
        });
        await getTimeEntriesListAction(abort.current.token);
    };

    const inputSelect = () => {
        const startDateFormatted = startDateValue.replace(/\D+/g, '');
        const endDateFormatted = endDateValue.replace(/\D+/g, '');

        if (
            startDateFormatted &&
            endDateFormatted &&
            endDateFormatted.length === 8 &&
            startDateFormatted.length === 8 &&
            moment(startDateValue, dateFormat)._isValid &&
            moment(endDateValue, dateFormat)._isValid
        ) {
            const newStartDate = new Date(moment(startDateValue, dateFormat));
            const newEndDate = new Date(moment(endDateValue, dateFormat));
            if (newStartDate <= newEndDate) {
                handleSelect({
                    selection: {
                        ...selectionRange,
                        startDate: newStartDate,
                        endDate: newEndDate,
                    },
                });
            }
        }
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
        setStartDateValue(moment(moment().startOf('month')).format(dateFormat));
        setEndDateValue(moment(moment().endOf('month')).format(dateFormat));
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
                <div className="timer-search__date-select-header">
                    <span onClick={() => (!showCallendar ? setShowCallendar(true) : null)}>
                        <InputMask
                            className="select_input"
                            onChange={e => setStartDateValue(e.target.value)}
                            mask={dateFormat.toLowerCase()}
                            formatChars={{ d: '[0-9]', m: '[0-9]', y: '[0-9]' }}
                            value={startDateValue}
                            onKeyUp={e => {
                                if (e.keyCode === 13) {
                                    inputSelect();
                                } else {
                                    return;
                                }
                            }}
                        />
                        {'-'}
                        <InputMask
                            className="select_input"
                            onChange={e => setEndDateValue(e.target.value)}
                            mask={dateFormat.toLowerCase()}
                            formatChars={{ d: '[0-9]', m: '[0-9]', y: '[0-9]' }}
                            value={endDateValue}
                            onKeyUp={e => {
                                if (e.keyCode === 13) {
                                    inputSelect();
                                } else {
                                    return;
                                }
                            }}
                        />
                    </span>
                    <i
                        className={`timer-search__date-select-arrow-down ${
                            showCallendar ? 'timer-search__date-select-arrow-down_up' : ''
                        }`}
                        onClick={() => setShowCallendar(!showCallendar)}
                    />
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
                                v_last_year,
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
