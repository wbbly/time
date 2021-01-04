import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setFirstDayOfWeek } from '../../actions/UserActions';

import moment from 'moment';

import './style.scss';

const toUpperCaseFirstLetter = str => str[0].toUpperCase() + str.slice(1);

class SelectFirstDayOfWeek extends Component {
    state = {
        isOpenDropdown: false,
        value: 1,
        list: [0, 1, 2, 3, 4, 5, 6],
    };

    setValue = value => {
        const { setFirstDayOfWeek } = this.props;
        localStorage.setItem('firstDayOfWeek', value);
        setFirstDayOfWeek(value);
        this.setState({
            value,
        });
    };

    closeDropdown = event => {
        document.removeEventListener('click', this.closeDropdown);
        this.setState({ isOpenDropdown: false });
    };

    openDropdown = event => {
        document.addEventListener('click', this.closeDropdown);
        this.setState({ isOpenDropdown: true });
    };

    componentDidMount() {
        const { firstDayOfWeek } = this.props;
        this.setValue(firstDayOfWeek);
    }

    render() {
        const { value, list, isOpenDropdown } = this.state;
        const { vocabulary } = this.props;
        const { lang, v_first_day_of_week } = vocabulary;

        return (
            <div className="first-day-week-format">
                <div className="first-day-week-format__title">{v_first_day_of_week}:</div>
                <div className="first-day-week-format_select" onClick={this.openDropdown}>
                    <span>
                        {toUpperCaseFirstLetter(
                            moment()
                                .locale(lang.short)
                                .day(value)
                                .format('dddd')
                        )}
                    </span>

                    {isOpenDropdown && (
                        <div className="first-day-week-format__list">
                            {list.map(item => (
                                <div
                                    key={item}
                                    className="first-day-week-format__list-item"
                                    onClick={event => {
                                        this.setValue(item);
                                    }}
                                >
                                    {toUpperCaseFirstLetter(
                                        moment()
                                            .locale(lang.short)
                                            .day(item)
                                            .format('dddd')
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <i
                        className={`first-day-week-format__icon-arrow ${
                            isOpenDropdown ? 'first-day-week-format__icon-arrow_up' : ''
                        }`}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    firstDayOfWeek: state.userReducer.firstDayOfWeek,
});

const mapDispatchToProps = {
    setFirstDayOfWeek,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectFirstDayOfWeek);
