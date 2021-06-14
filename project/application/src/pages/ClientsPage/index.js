import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import classNames from 'classnames';

// Components
import { Loading } from '../../components/Loading';
import ClientModal from '../../components/ClientModal';
import { BlankListComponent } from '../../components/CommonComponents/BlankListcomponent/BlankListComponent';
import { ClientComponent } from '../../components/ClientComponent/index';
import CustomScrollbar from '../../components/CustomScrollbar';
import PageHeader from '../../components/PageHeader/index';
import FilterByStatus from '../../components/FilterByStatus';
// Actions
import {
    getClientsAction,
    addClientAction,
    editClientThunk,
    deleteClientThunk,
    changeClientActiveStatusAction,
    resetClientsParamsAction,
} from '../../actions/ClientsActions';
import { showNotificationAction } from '../../actions/NotificationActions';

// Services
import { checkIsAdminByRole, checkIsOwnerByRole } from '../../services/authentication';

// Styles
import './style.scss';
import ModalPortal from '../../components/ModalPortal';

class ClientsPage extends Component {
    state = {
        showModal: false,
        editedClient: null,
        stateSearchValue: '',
        clientsList: [],
        isOpenDropdown: false,
        isInitialFetching: true,
    };

    componentDidMount() {
        this.props.getClientsAction();
    }

    componentWillUnmount() {
        this.props.resetClientsParamsAction();
    }

    componentDidUpdate(prevProps, prevState) {
        const { currentTeam, history, clientsList } = this.props;
        if (!prevProps.currentTeam.data.id && this.props.currentTeam.data.id) {
            if (!checkIsAdminByRole(currentTeam.data.role) && !checkIsOwnerByRole(currentTeam.data.role)) {
                history.push('/timer');
            }
        }
        if (prevProps.clientsList !== clientsList) {
            this.setState({ clientsList, isInitialFetching: false });
        }
    }

    closeModal = () => {
        this.setState({ showModal: false, editedClient: null });
    };

    editClient = (client, id, logoFile) => {
        const { editClientThunk } = this.props;

        const phone = client.phone ? '+' + client.phone.replace(/[^0-9]/g, '') : null;
        const data = { ...client, phone: phone };
        editClientThunk(data, id, logoFile);
        this.closeModal();
    };

    deleteClient = id => {
        this.props.deleteClientThunk(id);
        this.closeModal();
    };

    searchClient = searchValue => {
        this.props.getClientsAction({
            searchValue,
        });
    };

    addNewClient = (client, logoFile) => {
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
            this.props.addClientAction(data, logoFile);
            showNotificationAction({
                text: client_was_created,
                type: 'success',
            });
            this.closeModal();
        }
    };

    onSearchValueChange = e => {
        this.setState({ stateSearchValue: e.target.value });
    };

    checkClientName = name => {
        const { clientsList } = this.props;
        const isTheSameName = clientsList.some(
            obj => obj.company_name && obj.company_name.toLowerCase().trim() === name.toLowerCase().trim()
        );
        return isTheSameName;
    };

    setFilterStatus = status => {
        this.props.getClientsAction({
            filterStatus: status,
        });
    };

    changeClientActiveStatus = async (clientId, isActive) => {
        await this.props.changeClientActiveStatusAction(clientId, isActive);
        this.props.getClientsAction();
    };

    resetFilters = () => {
        this.setState({ stateSearchValue: '' });
        this.props.getClientsAction({
            searchValue: '',
            filterStatus: 'all',
        });
    };

    render() {
        const { showModal, stateSearchValue, editedClient, clientsList, isInitialFetching } = this.state;
        const { vocabulary, isMobile, currentTeam, clientsFetching, filterStatus } = this.props;
        const {
            v_clients,
            v_add_new_client,
            v_apply,
            v_clear_filters,
            v_filter_all_clients,
            v_filter_active,
            v_filter_archived,
        } = vocabulary;

        const editClient = index => {
            this.setState({ editedClient: clientsList[index], showModal: true });
        };
        return (
            <Loading flag={isInitialFetching || currentTeam.isFetching} mode="parentSize" withLogo={false}>
                <Loading flag={clientsFetching} mode="overlay" withLogo={false}>
                    <div
                        className={classNames('wrapper_clients_page', {
                            'wrapper_clients_page--mobile': isMobile,
                        })}
                    >
                        {showModal && (
                            <ModalPortal>
                                <ClientModal
                                    closeModal={this.closeModal}
                                    addNewClient={this.addNewClient}
                                    toEditClient={this.editClient}
                                    deleteClient={this.deleteClient}
                                    editedClient={editedClient}
                                    vocabulary={vocabulary}
                                />
                            </ModalPortal>
                        )}
                        <div className="data_container_clients_page">
                            <div className="data_container_clients_page_top">
                                <PageHeader title={v_clients}>
                                    <button
                                        className="header-wrapper__child-button"
                                        onClick={() => this.setState({ showModal: true })}
                                    >
                                        {v_add_new_client}
                                    </button>
                                </PageHeader>
                                <div className="clients_search_bar__container">
                                    <div className="wrapper_clients_search_bar">
                                        <div className="clients_search_bar_search_field_container">
                                            <i className="magnifer" />
                                            <input
                                                onChange={this.onSearchValueChange}
                                                type="text"
                                                value={stateSearchValue}
                                                onKeyUp={e =>
                                                    e.keyCode === 13 ? this.searchClient(stateSearchValue) : null
                                                }
                                                className="clients_search_bar_search_field"
                                            />
                                        </div>
                                        <div className="clients_search_bar_button_container">
                                            <button
                                                className="clients_search_bar_button"
                                                onClick={() => this.searchClient(stateSearchValue)}
                                            >
                                                {v_apply}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="reset-clients">
                                    <div className="reset-clients__button" onClick={this.resetFilters}>
                                        {v_clear_filters}
                                    </div>
                                </div>
                            </div>
                            <FilterByStatus
                                status={filterStatus}
                                onClick={this.setFilterStatus}
                                items={[
                                    {
                                        id: 'all',
                                        text: v_filter_all_clients,
                                    },
                                    {
                                        id: 'active',
                                        text: v_filter_active,
                                    },
                                    {
                                        id: 'archived',
                                        text: v_filter_archived,
                                    },
                                ]}
                            />
                            <div className="clients_list_container">
                                <div className={classNames('clients_list')}>
                                    {clientsList &&
                                        clientsList.length === 0 &&
                                        BlankListComponent(this.props.vocabulary.v_no_clients, null, null)}
                                    {!!clientsList.length && (
                                        <CustomScrollbar>
                                            {clientsList.map((item, index) => (
                                                <ClientComponent
                                                    client={item}
                                                    vocabulary={vocabulary}
                                                    index={index}
                                                    editClient={editClient}
                                                    key={index}
                                                    isMobile={isMobile}
                                                    changeClientActiveStatus={this.changeClientActiveStatus}
                                                />
                                            ))}
                                        </CustomScrollbar>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Loading>
            </Loading>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    currentTeam: state.teamReducer.currentTeam,
    isMobile: state.responsiveReducer.isMobile,
    clientsList: state.clientsReducer.clientsList,
    searchValue: state.clientsReducer.searchValue,
    filterStatus: state.clientsReducer.filterStatus,
    clientsFetching: state.clientsReducer.isFetching,
});

const mapDispatchToProps = {
    getClientsAction,
    addClientAction,
    editClientThunk,
    deleteClientThunk,
    showNotificationAction,
    changeClientActiveStatusAction,
    resetClientsParamsAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ClientsPage)
);
