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
// Actions
import { getClientsAction, setClientAction, editClientThunk, deleteClientThunk } from '../../actions/ClientsActions';
import { showNotificationAction } from '../../actions/NotificationActions';

// Services
import { checkIsAdminByRole } from '../../services/authentication';

// Styles
import './style.scss';

class ClientsPage extends Component {
    state = {
        showModal: false,
        searchValue: '',
        editedClient: null,
        clientsList: [],
        isOpenDropdown: false,
        isInitialFetching: true,
    };

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

    searchClient = async () => {
        const { searchValue } = this.state;
        const { clientsList } = this.props;
        let afterSearch = clientsList.filter(
            obj => obj.company_name.toLowerCase().indexOf(searchValue.toLowerCase().trim()) !== -1
        );
        this.setState({ clientsList: afterSearch });
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
            this.props.setClientAction(data, logoFile);
            showNotificationAction({
                text: client_was_created,
                type: 'success',
            });
            this.closeModal();
        }
    };

    handleChange = e => {
        const { clientsList } = this.props;
        this.setState({ searchValue: e.target.value });
        if (e.target.value.length === 0) {
            this.setState({ clientsList });
        }
    };

    checkClientName = name => {
        const { clientsList } = this.props;
        const isTheSameName = clientsList.some(obj => {
            if (obj.company_name) {
                return obj.company_name.toLowerCase().trim() === name.toLowerCase().trim();
            }
        });
        return isTheSameName;
    };

    componentDidMount() {
        this.props.getClientsAction();
    }

    componentDidUpdate(prevProps, prevState) {
        const { currentTeam, history, clientsList } = this.props;
        if (!prevProps.currentTeam.data.id && this.props.currentTeam.data.id) {
            if (!checkIsAdminByRole(currentTeam.data.role)) {
                history.push('/timer');
            }
        }
        if (prevProps.clientsList !== clientsList) {
            this.setState({ clientsList, isInitialFetching: false });
        }
    }

    render() {
        const { showModal, searchValue, editedClient, clientsList, isInitialFetching } = this.state;
        const { vocabulary, isMobile, currentTeam } = this.props;
        const { v_clients, v_add_new_client, v_apply } = vocabulary;

        const editClient = index => {
            this.setState({ editedClient: clientsList[index], showModal: true });
        };
        return (
            <Loading flag={isInitialFetching || currentTeam.isFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar>
                    <div
                        className={classNames('wrapper_clients_page', {
                            'wrapper_clients_page--mobile': isMobile,
                        })}
                    >
                        {showModal && (
                            <ClientModal
                                closeModal={this.closeModal}
                                addNewClient={this.addNewClient}
                                toEditClient={this.editClient}
                                deleteClient={this.deleteClient}
                                editedClient={editedClient}
                                vocabulary={vocabulary}
                            />
                        )}
                        <div className="data_container_clients_page">
                            <PageHeader title={v_clients}>
                                <button
                                    className="header-wrapper__child-button"
                                    onClick={() => this.setState({ showModal: true })}
                                >
                                    {v_add_new_client}
                                </button>
                            </PageHeader>

                            <div className="wrapper_clients_search_bar">
                                <div className="clients_search_bar_search_field_container">
                                    <i className="magnifer" />
                                    <input
                                        onChange={this.handleChange}
                                        type="text"
                                        value={searchValue}
                                        onKeyUp={e => (e.keyCode === 13 ? this.searchClient() : null)}
                                        className="clients_search_bar_search_field"
                                    />
                                </div>
                                <div className="clients_search_bar_button_container">
                                    <button className="clients_search_bar_button" onClick={this.searchClient}>
                                        {v_apply}
                                    </button>
                                </div>
                            </div>
                            <div className={classNames('clients_list_container')}>
                                {clientsList &&
                                    clientsList.length === 0 &&
                                    BlankListComponent(this.props.vocabulary.v_no_clients, null, null)}
                                {!!clientsList.length &&
                                    clientsList.map((item, index) => (
                                        <ClientComponent
                                            client={item}
                                            vocabulary={vocabulary}
                                            index={index}
                                            editClient={editClient}
                                            key={index}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </CustomScrollbar>
            </Loading>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    currentTeam: state.teamReducer.currentTeam,
    isMobile: state.responsiveReducer.isMobile,
    isInitialFetching: state.clientsReducer.isInitialFetching,
    clientsList: state.clientsReducer.clientsList,
});

const mapDispatchToProps = {
    getClientsAction,
    setClientAction,
    editClientThunk,
    deleteClientThunk,
    showNotificationAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ClientsPage)
);
