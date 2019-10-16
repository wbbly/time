import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setDateFormat } from '../../actions/UserActions';

import './style.scss';

class SelectDateFormat extends Component {
    state = {
        isOpenDropdown: false,
        value: '',
        list: ['MM/DD/YYYY', 'DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'DD.MM.YYYY'],
    };

    setValue = value => {
        const { setDateFormat } = this.props;
        localStorage.setItem('dateFormat', value);
        setDateFormat(value);
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
        const { dateFormat } = this.props;
        this.setValue(dateFormat);
    }

    render() {
        const { value, list, isOpenDropdown } = this.state;
        const { vocabulary } = this.props;
        const { v_date_format } = vocabulary;

        return (
            <div className="date-format">
                <div className="date-format__title">{v_date_format}:</div>
                <div className="date-format_select" onClick={this.openDropdown}>
                    <span>{value}</span>

                    {isOpenDropdown && (
                        <div className="date-format__list">
                            {list.map(item => (
                                <div
                                    key={item}
                                    className="date-format__list-item"
                                    onClick={event => {
                                        this.setValue(item);
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                    <i className="date-format__icon-arrow" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    dateFormat: state.userReducer.dateFormat,
});

const mapDispatchToProps = {
    setDateFormat,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectDateFormat);
