import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';

// Styles
import './style.scss';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import enLocale from 'date-fns/locale/en-GB';
import ruLocale from 'date-fns/locale/ru';
import deLocale from 'date-fns/locale/de';
import itLocale from 'date-fns/locale/it';
import uaLocale from 'date-fns/locale/uk';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import moment from 'moment';

const localeMap = {
    en: enLocale,
    ru: ruLocale,
    de: deLocale,
    it: itLocale,
    uk: uaLocale,
};

const muiTheme = createMuiTheme({
    overrides: {
        MuiFormHelperText: {
            root: {
                display: 'none',
            },
        },
        MuiTypography: {
            root: {
                fontSize: '1.7rem !important',
            },
        },
        MuiInputAdornment: {
            root: {
                display: 'none',
            },
        },
        MuiInput: {
            root: {
                fontSize: '1.7rem !important',
            },
        },
        MuiFormControl: {
            root: {
                width: '100%',
            },
        },
        MuiPickersDay: {
            current: {
                color: '#27ae60',
            },
            daySelected: {
                backgroundColor: '#27ae60',
                '&:hover': {
                    backgroundColor: '#27ae60',
                },
            },
        },
    },
});

const CalendarIcon = className => (
    <svg
        className={className}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M15.8333 3.33398H4.16667C3.24619 3.33398 2.5 4.08018 2.5 5.00065V16.6673C2.5 17.5878 3.24619 18.334 4.16667 18.334H15.8333C16.7538 18.334 17.5 17.5878 17.5 16.6673V5.00065C17.5 4.08018 16.7538 3.33398 15.8333 3.33398Z"
            stroke="#D3DCE6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13.334 1.66602V4.99935"
            stroke="#D3DCE6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.66602 1.66602V4.99935"
            stroke="#D3DCE6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M2.5 8.33398H17.5" stroke="#D3DCE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

class CalendarSelect extends Component {
    constructor(props) {
        super(props);

        this.dropdown = React.createRef();

        this.state = {
            isOpen: false,
        };
    }

    openDropdown = event => {
        const { onChangeVisibility, disabled } = this.props;
        if (disabled) return;
        this.setState(
            {
                isOpen: true,
            },
            () => onChangeVisibility(true)
        );
        document.addEventListener('click', this.closeDropdown);
    };

    closeDropdown = event => {
        let target = event.target;
        let path = [];
        while (target.parentNode !== null) {
            path.push(target);
            target = target.parentNode;
        }

        for (let node of path) {
            if (node.className === 'calendar-select__dropdown') {
                return;
            }
        }

        if (!event.target.classList.contains('calendar-select__dropdown-list-input')) {
            const { onChangeVisibility } = this.props;
            document.removeEventListener('click', this.closeDropdown);
            this.setState(
                {
                    isOpen: false,
                },
                () => onChangeVisibility(false)
            );
        }
    };

    componentDidUpdate(prevProps, prevState) {
        const { isOpen } = this.state;
        const { scrollToAction, withFolder } = this.props;

        if (!prevState.isOpen && isOpen) {
            if (!withFolder) {
                const height = window.innerHeight || window.document.documentElement.clientHeight;
                const boundingClientRect = this.dropdown.current.getBoundingClientRect();
                const { bottom } = boundingClientRect;
                if (bottom > height) {
                    const diff = bottom - height;
                    scrollToAction(diff);
                }
            }
        }
        if (prevState.isOpen && !isOpen) {
        }
    }

    componentWillUnmount() {
        const { onChangeVisibility } = this.props;
        onChangeVisibility(false);
        document.removeEventListener('click', this.closeDropdown);
    }

    changeHandlerDate = date => {
        this.props.onChangeDate(date);
    };

    render() {
        const { vocabulary, isMobile, firstDayOfWeek, date, disabled, dateFormat } = this.props;
        const { lang } = vocabulary;
        const { isOpen } = this.state;

        const customLocale = localeMap[lang.short];
        customLocale.options.weekStartsOn = firstDayOfWeek;

        return (
            <div
                ref={ref => (this.container = ref)}
                className={classNames('calendar-select', {
                    'calendar-select--mobile': isMobile,
                    'calendar-select--disabled': disabled,
                })}
                onClick={this.openDropdown}
            >
                <div className="calendar-select__selected-date">
                    <span className="calendar-select__date">{moment(date).format(dateFormat)}</span>
                    {!disabled && <CalendarIcon />}
                </div>
                {isOpen && (
                    <div ref={this.dropdown} className={classNames('calendar-select__dropdown')}>
                        <ThemeProvider theme={muiTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={customLocale}>
                                <DatePicker
                                    autoOk
                                    disableToolbar={true}
                                    allowKeyboardControl={false}
                                    variant="static"
                                    openTo="date"
                                    value={date}
                                    onChange={this.changeHandlerDate}
                                    className="myDatePicker"
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </div>
                )}
            </div>
        );
    }
}

CalendarSelect.defaultProps = {
    onChangeVisibility: () => {},
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
    timeFormat: state.userReducer.timeFormat,
    dateFormat: state.userReducer.dateFormat,
    firstDayOfWeek: state.userReducer.firstDayOfWeek,
});

const mapDispatchToProps = {
    scrollToAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarSelect);
