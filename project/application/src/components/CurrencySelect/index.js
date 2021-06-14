import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';

// Styles
import './style.scss';

import currenciesList from '../../services/currenciesList.json';

class CurrencySelect extends Component {
    constructor(props) {
        super(props);

        this.dropdown = React.createRef();
        this.input = React.createRef();

        this.state = {
            isOpen: false,
            inputValue: '',
            currencyList: [],
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
        if (!event.target.classList.contains('currency-select__dropdown-list-input')) {
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

    searchCurrency = event => {
        this.setState({ inputValue: event.target.value });
        if (event.target.value.length === 0) {
            this.setState({ currencyList: Object.values(currenciesList) });
        } else {
            let filteredCurrency = Object.values(currenciesList).filter(
                item =>
                    item.code.toLowerCase().indexOf(event.target.value.toLowerCase().trim()) >= 0 ||
                    item.name.toLowerCase().indexOf(event.target.value.toLowerCase().trim()) >= 0
            );
            this.setState({ currencyList: filteredCurrency });
        }
    };

    componentDidMount() {
        this.setState({
            currencyList: Object.values(currenciesList),
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { isOpen } = this.state;
        const { scrollToAction, withFolder } = this.props;

        if (!prevState.isOpen && isOpen) {
            this.input.current.focus();
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
    }

    componentWillUnmount() {
        const { onChangeVisibility } = this.props;
        onChangeVisibility(false);
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        const { onChange, listItem, isMobile, selectedCurrency, isViewMode, vocabulary } = this.props;
        const { v_select_currency } = vocabulary;
        const { isOpen, inputValue, currencyList } = this.state;

        return (
            <div
                className={classNames('currency-select', {
                    'currency-select--list-item': listItem,
                    'currency-select--mobile': isMobile,
                })}
                style={!isViewMode ? { cursor: 'pointer' } : { cursor: 'text' }}
                onClick={() => {
                    if (!isViewMode) {
                        this.openDropdown();
                    }
                }}
            >
                <div className="currency-select__selected-currency">
                    <span className="currency-select__currency-name">{selectedCurrency.toUpperCase()}</span>
                    {!isViewMode && <i className={`arrow_down ${isOpen ? 'arrow_down_up' : ''}`} />}
                </div>
                {isOpen && (
                    <div ref={this.dropdown} className={classNames('currency-select__dropdown')}>
                        <div className="currency-select__dropdown-title">{v_select_currency}</div>
                        <div className="currency-select__dropdown-input">
                            <input
                                className="currency-select__dropdown-list-input"
                                type="text"
                                onChange={this.searchCurrency}
                                value={inputValue}
                                ref={this.input}
                            />
                        </div>
                        <div className="currency-select__dropdown-list">
                            {currencyList.map((currency, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="currency-select__dropdown-list-item"
                                        onClick={event => onChange(currency.code)}
                                    >
                                        <span className="currency-select__dropdown-list-item-currency-name">
                                            {`${currency.code.toUpperCase()} - ${currency.name}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

CurrencySelect.defaultProps = {
    onChangeVisibility: () => {},
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    scrollToAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CurrencySelect);
