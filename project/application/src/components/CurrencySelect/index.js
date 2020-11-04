import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';

// Styles
import './style.scss';

import currenciesList from '../../services/currenciesList.json';
// const currencies = ['usd', 'eur', 'uah'];

const ArrowIcon = className => (
    <svg className={className} width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 7L0.73686 0.25L10.2631 0.250001L5.5 7Z" fill="white" />
    </svg>
);

class CurrencySelect extends Component {
    constructor(props) {
        super(props);

        this.dropdown = React.createRef();

        this.state = {
            isOpen: false,
            inputValue: '',
            currencyList: [],
        };
    }

    // static getDerivedStateFromProps(props, state) {
    //     if (state.projectsList === null) {
    //         const { projectsList } = props;
    //         return {
    //             projectsList,
    //         };
    //     }
    //     return null;
    // }

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
                    item.code.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0 ||
                    item.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0
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

    render() {
        const { onChange, listItem, isMobile, selectedCurrency, isViewMode } = this.props;
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
                    {!isViewMode && <ArrowIcon />}
                </div>
                {isOpen && (
                    <div ref={this.dropdown} className={classNames('currency-select__dropdown')}>
                        <div className="currency-select__dropdown-input">
                            <input
                                className="currency-select__dropdown-list-input"
                                type="text"
                                onChange={this.searchCurrency}
                                value={inputValue}
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
