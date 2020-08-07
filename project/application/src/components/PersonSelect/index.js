import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { AppConfig } from '../../config';
// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';

// Styles
import './style.scss';
import defaultLogo from '../../images/icons/Group20.svg';

const PlusSvg = () => {
    return (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3.85651" width="1.28571" height="9" fill="#02AF67" />
            <rect
                x="8.99896"
                y="3.85663"
                width="1.28571"
                height="9"
                transform="rotate(90 8.99896 3.85663)"
                fill="#02AF67"
            />
        </svg>
    );
};

class PersonSelect extends Component {
    state = {
        personsList: null,
        isOpen: false,
        inputValue: '',
        isAvatar: false,
    };

    static getDerivedStateFromProps(props, state) {
        if (state.personsList === null) {
            const { personsList } = props;
            return {
                personsList,
            };
        }
        return null;
    }

    getPersonData = key => {
        const { personsList, selectedPersonId, placeholder } = this.props;
        if (personsList) {
            const filteredList = personsList.filter(person => person.id === selectedPersonId);
            if (!filteredList.length && key !== 'email' && key !== 'avatar') {
                return placeholder;
            } else if (filteredList.length) {
                if (key === 'avatar' && filteredList.length) {
                    return filteredList[0].avatar;
                } else if (key === 'username') {
                    return filteredList[0].username ? filteredList[0].username : filteredList[0].name;
                } else if (key === 'email') {
                    return filteredList[0]['email'] ? filteredList[0]['email'] : '';
                }
            }
        }
    };

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
        if (!event.target.classList.contains('person-select__dropdown-list-input')) {
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

    onChangeInput = event => {
        const value = event.target.value;
        this.setState({
            inputValue: value.trim().toLowerCase(),
        });
    };

    filterList = initial => {
        const { personsList } = this.props;
        const { inputValue } = this.state;

        const filteredList = personsList.filter(
            person =>
                person.username
                    ? person.username.toLowerCase().indexOf(inputValue) !== -1
                    : person.name.toLowerCase().indexOf(inputValue) !== -1
        );
        this.setState({
            personsList: initial ? personsList : filteredList,
        });
    };

    componentDidUpdate(prevProps, prevState) {
        const { isOpen, inputValue } = this.state;
        const { scrollToAction, withFolder } = this.props;
        const { dropdown } = this.refs;

        if (!prevState.isOpen && isOpen) {
            this.input.current.focus();
            if (!withFolder) {
                const height = window.innerHeight || window.document.documentElement.clientHeight;
                const boundingClientRect = dropdown.getBoundingClientRect();
                const { bottom } = boundingClientRect;
                if (bottom > height) {
                    const diff = bottom - height;
                    scrollToAction(diff);
                }
            }
        }
        if (prevState.isOpen && !isOpen) {
            this.setState({
                inputValue: '',
            });
        }

        if (prevState.inputValue !== inputValue) {
            if (inputValue) {
                this.filterList();
            } else {
                this.filterList(true);
            }
        }
    }

    componentWillUnmount() {
        const { onChangeVisibility } = this.props;
        onChangeVisibility(false);
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        let isAvatar = this.getPersonData('avatar');
        const { vocabulary, onChange, isMobile, disabled, withAddLink, history, isError, isErrorSender } = this.props;
        const { v_find } = vocabulary;
        const { isOpen, personsList, inputValue } = this.state;
        return (
            <div
                className={classNames('person-select', {
                    'person-select--mobile': isMobile,
                    'person-select--disabled': disabled,
                    'person-select--error': isError || isErrorSender,
                })}
                onClick={this.openDropdown}
            >
                <div className="person-select__selected-person">
                    {isAvatar ? (
                        <span
                            className="avatar-img-small"
                            style={{
                                backgroundImage: `url("${AppConfig.apiURL}${isAvatar}")`,
                            }}
                        />
                    ) : (
                        <img alt="person-select__default_avatar" src={defaultLogo} className="default-logo" />
                    )}
                    <div className="data-wrapper">
                        <div className="person-select__selected-person-row">
                            <span>{this.getPersonData('username')}</span>
                        </div>
                        <div className="person-select__selected-email">
                            <span>{this.getPersonData('email')}</span>
                        </div>
                    </div>
                </div>
                {isOpen && (
                    <div ref="dropdown" className="person-select__dropdown">
                        <input
                            className="person-select__dropdown-list-input"
                            ref={(this.input = React.createRef())}
                            value={inputValue}
                            onChange={this.onChangeInput}
                            type="text"
                            placeholder={`${v_find}...`}
                        />
                        <div className="person-select__dropdown-list">
                            {withAddLink && (
                                <div
                                    className="person-select__dropdown-list-item"
                                    onClick={event => history.push('/clients')}
                                >
                                    <span className="person-select__add-icon">
                                        <PlusSvg />
                                    </span>
                                    <span className="person-select__dropdown-list-item-username">Add client</span>
                                </div>
                            )}
                            {personsList.map(person => {
                                return (
                                    <div
                                        key={person.id}
                                        className="person-select__dropdown-list-item"
                                        onClick={event => onChange(person)}
                                    >
                                        <span className="person-select__dropdown-list-item-username">
                                            {person.username || person.name}
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

PersonSelect.defaultProps = {
    onChangeVisibility: () => {},
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    scrollToAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PersonSelect)
);
