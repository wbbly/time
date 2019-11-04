import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import classNames from 'classnames';

// Components
import { Loading } from '../../components/Loading';
import ClientModal from '../../components/ClientModal';

// Actions
import { getClientsAction, setClientAction, editClientNameAction } from '../../actions/ClientsActions';

// Services
import { checkIsAdminByRole } from '../../services/authentication';

// Styles
import './style.scss';

class ClientsPage extends Component {
    state = {
        showModal: false,
        searchValue: '',
        editedItem: null,
        clientsList: [],
    };
    closeModal = () => {
        this.setState({ showModal: false, editedItem: null });
    };
    editClient = (clientName, id) => {
        const { editedItem } = this.state;
        if (clientName.length === 0) {
            alert('empty');
            return;
        } else if (clientName === editedItem.name) {
            this.closeModal();
            return;
        } else if (this.checkClientName(clientName)) {
            alert('already have');
            return;
        } else {
            this.props.editClientNameAction(clientName, id);
            this.closeModal();
            alert('edited');
        }
    };
    searchClient = async () => {
        const { searchValue } = this.state;
        const { clientsList } = this.props;
        let afterSearch = clientsList.filter(
            obj => obj.name.toLowerCase().indexOf(searchValue.toLowerCase().trim()) !== -1
        );
        this.setState({ clientsList: afterSearch });
    };
    addNewClient = client => {
        if (client.length === 0) {
            alert('empty');
            return;
        } else if (this.checkClientName(client)) {
            alert('already have');
            return;
        } else {
            this.props.setClientAction(client);
            this.closeModal();
            alert('added');
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
        return clientsList.some(obj => obj.name.toLowerCase().trim() === name.toLowerCase().trim());
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
            this.setState({ clientsList });
        }
    }

    render() {
        const { showModal, searchValue, editedItem, clientsList } = this.state;
        const { vocabulary, isMobile, currentTeam, isInitialFetching } = this.props;
        return (
            <Loading flag={isInitialFetching || currentTeam.isFetching} mode="parentSize" withLogo={false}>
                <div
                    className={classNames('wrapper_clients_page', {
                        'wrapper_clients_page--mobile': isMobile,
                    })}
                >
                    {showModal && (
                        <ClientModal
                            closeModal={this.closeModal}
                            addNewClient={this.addNewClient}
                            editClient={this.editClient}
                            editedItem={editedItem}
                            vocabulary={vocabulary}
                        />
                    )}
                    <div className="data_container_clients_page">
                        <div className="clients_page_header">
                            <div className="clients_page_title">Clients</div>
                            {true && (
                                <button className="add_client_button" onClick={e => this.setState({ showModal: true })}>
                                    Add new client
                                </button>
                            )}
                        </div>
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
                                    Apply
                                </button>
                            </div>
                        </div>
                        <div className="clients_list_container">
                            {clientsList.map((item, index) => (
                                <div className="clients_list_item" key={item.id}>
                                    <div className="client_name" data-label="Client Name: ">
                                        {item.name}
                                    </div>
                                    <i
                                        className="client_edit"
                                        onClick={() =>
                                            this.setState({ editedItem: clientsList[index], showModal: true })
                                        }
                                    />
                                    {item.project.length !== 0 && (
                                        <div className="clients_project_container">
                                            {item.project.map((item, index) => (
                                                <div className="clients_project" key={index}>
                                                    <div
                                                        className={`clients_project-color-circle ${
                                                            item.project_color.name
                                                        }`}
                                                    />
                                                    <div className="clients-project-name">{item.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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
    editClientNameAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ClientsPage)
);
