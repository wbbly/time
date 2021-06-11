import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';
import { addClientAction } from '../../actions/ClientsActions';
import { showNotificationAction } from '../../actions/NotificationActions';
// Styles
import './style.scss';
import clientSelect from '../../images/icons/add_client.svg';

// Components
import InvoiceSenderRecipienModal from '../InvoiceSenderRecipienModal/index';

class PersonSelect extends Component {
    constructor(props) {
        super(props);

        this.dropdown = React.createRef();
        this.input = React.createRef();

        this.state = {
            personsList: null,
            isOpen: false,
            inputValue: '',
            isAvatar: false,
            openModal: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.personsList === null) {
            const { personsList } = props;
            return {
                personsList,
            };
        }
        return null;
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
    openModal() {
        const { disabled } = this.props;
        if (disabled) return;
        this.setState({ openModal: true });
    }
    closeModal = () => {
        this.setState({ openModal: false });
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
            inputValue: value,
        });
    };

    filterList = initial => {
        const { personsList } = this.props;
        const { inputValue } = this.state;
        let filteredList = [];
        if (personsList) {
            filteredList = personsList.filter(
                person => this.getClientFullName(person, false).indexOf(inputValue.toLowerCase().trim()) >= 0
            );
        }
        this.setState({
            personsList: initial ? personsList : filteredList,
        });
    };

    componentDidUpdate(prevProps, prevState) {
        const { isOpen, inputValue } = this.state;
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
        if (this.props.clientsList !== prevProps.clientsList) {
            this.setState({ personsList: this.props.clientsList });
        }
    }

    componentWillUnmount() {
        const { onChangeVisibility } = this.props;
        onChangeVisibility(false);
        document.removeEventListener('click', this.closeDropdown);
    }
    checkClientName = name => {
        const { clientsList } = this.props;
        const isTheSameName = clientsList.some(
            obj => obj.company_name && obj.company_name.toLowerCase().trim() === name.toLowerCase().trim()
        );
        return isTheSameName;
    };
    addNewClient = async client => {
        const { showNotificationAction, vocabulary } = this.props;
        const { v_a_client_existed, v_a_client_name_empty_error, client_was_created } = vocabulary;
        if (client.length === 0) {
            showNotificationAction({ text: v_a_client_name_empty_error, type: 'warning' });
            return;
        } else if (this.checkClientName(client.company_name)) {
            showNotificationAction({ text: v_a_client_existed, type: 'warning' });
            return;
        } else {
            const phone = client.phone ? '+' + client.phone.replace(/[^0-9]/g, '') : null;
            const data = { ...client, phone: phone };
            const clientsList = await this.props.addClientAction(data);
            showNotificationAction({
                text: client_was_created,
                type: 'success',
            });
            const addedClient = clientsList.find(item => item.company_name === client.company_name);
            const fullClientData = { id: addedClient?.id, ...client };
            this.props.onChange(fullClientData);
            this.closeModal();
        }
    };
    getClientFullName(client, listView = true) {
        const { company_name, name } = client;
        // returns 'Company (Client Name)' for list visualization, or 'company clientname' for search
        if (listView) {
            return company_name ? `${company_name}${name ? ` (${name})` : ''}` : name;
        } else {
            return (company_name ? `${company_name}${name ? ` ${name}` : ''}` : name).toLowerCase();
        }
    }

    render() {
        const {
            vocabulary,
            onChange,
            isMobile,
            disabled,
            isError,
            isErrorSender,
            userSender,
            selectedRecipient,
            withAddLink,
        } = this.props;
        const { v_find, v_add_new_client, v_add_client } = vocabulary;
        const { isOpen, personsList, inputValue, openModal } = this.state;
        const setSender = values => {
            onChange(values);
            this.closeModal();
        };
        return (
            <>
                <div
                    className={classNames('person-select', {
                        'person-select--mobile': isMobile,
                        'person-select--disabled': disabled,
                        'person-select--error': isError || isErrorSender,
                    })}
                    onClick={() => {
                        if (userSender) {
                            this.openModal();
                        } else {
                            this.openDropdown();
                        }
                    }}
                >
                    {userSender && (
                        <div className="person-select__selected-person">
                            <div className="data-wrapper">
                                <div className="person-select__selected-person-row">
                                    {userSender.company_name && <div>{userSender.company_name}</div>}
                                    {userSender.companyName && <div>{userSender.companyName}</div>}
                                    {userSender.username && <div>{userSender.username}</div>}
                                    {userSender.name && <div>{userSender.name}</div>}
                                    {userSender.email && <div>{userSender.email}</div>}
                                    {userSender.phone && <div>{userSender.phone}</div>}
                                    <div>{`${(userSender.country && userSender.country) || '-'}${(userSender.state &&
                                        ', ' + userSender.state) ||
                                        ''}${(userSender.city && ', ' + userSender.city) || ''}${(userSender.zip &&
                                        ', ' + userSender.zip) ||
                                        ''}`}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedRecipient ? (
                        <div className="person-select__selected-person">
                            <div className="data-wrapper">
                                <div className="person-select__selected-person-row">
                                    <div>{selectedRecipient.company_name}</div>
                                    {selectedRecipient.username && <div>{selectedRecipient.username}</div>}
                                    {selectedRecipient.email && <div>{selectedRecipient.email}</div>}
                                    {selectedRecipient.phone && <div>{selectedRecipient.phone}</div>}
                                    <div>{`${(selectedRecipient.country && selectedRecipient.country) ||
                                        '-'}${(selectedRecipient.state && ', ' + selectedRecipient.state) ||
                                        ''}${(selectedRecipient.city && ', ' + selectedRecipient.city) ||
                                        ''}${(selectedRecipient.zip && ', ' + selectedRecipient.zip) || ''}`}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        !userSender && (
                            <div className="person-select__selected-person">
                                <div className="person-select__selected-person-container">
                                    <div className="client-select">
                                        <img src={clientSelect} alt="client select" />
                                        <div className={'text-client'}>{v_add_client}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                    {isOpen && (
                        <div ref={this.dropdown} className="person-select__dropdown">
                            <div className="person-select__dropdown-list-input">
                                <input
                                    ref={this.input}
                                    value={inputValue}
                                    onChange={this.onChangeInput}
                                    type="text"
                                    placeholder={`${v_find}...`}
                                />
                            </div>
                            <div className="person-select__dropdown-list">
                                {personsList &&
                                    personsList.map(person => {
                                        return (
                                            <div
                                                key={person.id}
                                                className="person-select__dropdown-list-item"
                                                onClick={event => onChange(person)}
                                            >
                                                <span className="person-select__dropdown-list-item-username">
                                                    {this.getClientFullName(person)}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div
                                className={classNames('person-select__dropdown-btn', {
                                    'person-select__dropdown-btn--disabled': !withAddLink,
                                })}
                                onClick={() => (withAddLink ? this.openModal() : null)}
                            >
                                <div>{v_add_new_client}</div>
                            </div>
                        </div>
                    )}
                </div>
                {openModal && (
                    <InvoiceSenderRecipienModal
                        vocabulary={vocabulary}
                        closeModal={this.closeModal}
                        addNewClient={this.addNewClient}
                        userSender={userSender}
                        setSender={setSender}
                    />
                )}
            </>
        );
    }
}

PersonSelect.defaultProps = {
    onChangeVisibility: () => {},
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
    clientsList: state.clientsReducer.clientsList,
});

const mapDispatchToProps = {
    scrollToAction,
    addClientAction,
    showNotificationAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PersonSelect)
);
