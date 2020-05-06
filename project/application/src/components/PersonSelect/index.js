import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';

// Styles
import './style.scss';

class PersonSelect extends Component {
    state = {
        personsList: null,
        isOpen: false,
        inputValue: '',
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
        try {
            const filteredList = personsList.filter(person => person.id === selectedPersonId);
            if (!filteredList.length) {
                return placeholder;
            }
            if (key === 'color') {
                return filteredList[0].projectColor.name;
            } else if (key === 'name') {
                return filteredList[0].name;
            } else if (key === 'username') {
                return filteredList[0].username ? filteredList[0].username : filteredList[0].name;
            }

            if (key) {
                return filteredList[0][key];
            }
            return filteredList[0];
        } catch (error) {
            // console.log(error);
            return placeholder;
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
        const { vocabulary, onChange, isMobile, selectedPersonId, disabled } = this.props;
        const { v_find, v_name, v_email, v_address } = vocabulary;
        const { isOpen, personsList, inputValue } = this.state;
        return (
            <div
                className={classNames('person-select', {
                    'person-select--mobile': isMobile,
                    'person-select--disabled': disabled,
                })}
                onClick={this.openDropdown}
            >
                <div className="person-select__selected-person">
                    <div className="person-select__selected-person-row">
                        <span className="person-select__title">{`${v_name}:`}</span>
                        <span>{this.getPersonData('username')}</span>
                    </div>
                    <div className="person-select__selected-person-row">
                        <span className="person-select__title">{`${v_email}:`}</span>
                        <span>{this.getPersonData('email')}</span>
                    </div>
                    <div className="person-select__selected-person-row">
                        <span className="person-select__title">{`${v_address}:`}</span>
                        <span>{this.getPersonData('address')}</span>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PersonSelect);
