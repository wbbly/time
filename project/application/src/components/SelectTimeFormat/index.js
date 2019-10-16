import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setTimeFormat } from '../../actions/UserActions';

import './style.scss';

class SelectTimeFormat extends Component {
    state = {
        isOpenDropdown: false,
        value: '24',
        list: ['12', '24'],
    };

    setValue = value => {
        const { setTimeFormat } = this.props;
        localStorage.setItem('timeFormat', value);
        setTimeFormat(value);
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
        const { timeFormat } = this.props;
        this.setValue(timeFormat);
    }

    render() {
        const { value, list, isOpenDropdown } = this.state;
        const { vocabulary } = this.props;
        const { v_time_format } = vocabulary;

        return (
            <div className="time-format">
                <div className="time-format__title">{v_time_format}:</div>
                <div className="time-format_select" onClick={this.openDropdown}>
                    <span>{value}</span>

                    {isOpenDropdown && (
                        <div className="time-format__list">
                            {list.map(item => (
                                <div
                                    key={item}
                                    className="time-format__list-item"
                                    onClick={event => {
                                        this.setValue(item);
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                    <i className="time-format__icon-arrow" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    timeFormat: state.userReducer.timeFormat,
});

const mapDispatchToProps = {
    setTimeFormat,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectTimeFormat);
