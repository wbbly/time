import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setDurationTimeFormat } from '../../actions/UserActions';

import './style.scss';

class SelectDurationTimeFormat extends Component {
    state = {
        isOpenDropdown: false,
        value: 'improved',
        list: ['classic', 'improved', 'decimal'],
    };

    setValue = value => {
        const { setDurationTimeFormat } = this.props;
        localStorage.setItem('durationTimeFormat', value);
        setDurationTimeFormat(value);
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
        const { durationTimeFormat } = this.props;
        this.setValue(durationTimeFormat);
    }

    render() {
        const { value, list, isOpenDropdown } = this.state;
        const { vocabulary } = this.props;
        const { v_duration_display_format, v_classic, v_improved, v_decimal } = vocabulary;
        const durationMap = {
            classic: `${v_classic} (1h 32m; 32m; 16s)`,
            improved: `${v_improved} (0:42:03)`,
            decimal: `${v_decimal} (0.67 h)`,
        };

        return (
            <div className="duration-time-format">
                <div className="duration-time-format__title">{v_duration_display_format}:</div>
                <div className="duration-time-format_select" onClick={this.openDropdown}>
                    <span>{durationMap[value]}</span>

                    {isOpenDropdown && (
                        <div className="duration-time-format__list">
                            {list.map(item => (
                                <div
                                    key={item}
                                    className="duration-time-format__list-item"
                                    onClick={event => {
                                        this.setValue(item);
                                    }}
                                >
                                    {durationMap[item]}
                                </div>
                            ))}
                        </div>
                    )}
                    <i
                        className={`duration-time-format__icon-arrow ${
                            isOpenDropdown ? 'duration-time-format__icon-arrow_up' : ''
                        }`}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    durationTimeFormat: state.userReducer.durationTimeFormat,
});

const mapDispatchToProps = {
    setDurationTimeFormat,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDurationTimeFormat);
