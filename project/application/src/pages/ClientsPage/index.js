import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import classNames from 'classnames';

// Components
import { Loading } from '../../components/Loading';
import ClientModal from '../../components/ClientModal';

// Actions

// Services
import { checkIsAdminByRole } from '../../services/authentication';

// Styles
import './style.scss';

const clientsArray = [
    {
        id: '5db9a5428440dc7c1d228564',
        name: 'Delaney Boone',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a54276d0f1be45431716',
        name: 'Melisa William',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542cc897674fa839936',
        name: 'Hahn Mckay',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542005bac0f8e7d77a5',
        name: 'Adams Morales',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542bd740361e9cc5e45',
        name: 'Wilkerson Hines',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a5428f32cba395d4815e',
        name: 'Gamble Woods',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a5423496d67ef5c56095',
        name: 'Bowen Lee',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a54273fa8808564aa70a',
        name: 'Sanders Rosa',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a5423d37571203973f49',
        name: 'Lawanda Delgado',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a54224241402e57e11c6',
        name: 'Mcclure Landry',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542cd6295ab5afdeb38',
        name: 'Cline Curtis',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a542e970061626254421',
        name: 'Judy Williams',
        totalTime: '00:00:00',
    },
    {
        id: '5db9a54209670125c7a0dea4',
        name: 'Aileen Silva',
        totalTime: '00:00:00',
    },
];

class ClientsPage extends Component {
    state = {
        isInitialFetching: true,
        showModal: false,
        searchValue: '',
        editedItem: null,
        clientsList: [],
    };
    closeModal = () => {
        this.setState({ showModal: false, editedItem: null });
    };
    editClient = (clientName, id) => {
        const { clientsList } = this.state;
        if (clientName.length === 0) {
            alert('empty');
            return;
        } else {
            clientsList.forEach(item => {
                if (item.id === id) {
                    item.name = clientName;
                }
            });
            this.setState({ clientsList });
            this.closeModal();
        }
    };
    searchClient = () => {
        const { searchValue } = this.state;
        let afterSearch = clientsArray.filter(
            obj => obj.name.toLowerCase().indexOf(searchValue.toLowerCase().trim()) !== -1
        );
        this.setState({ clientsList: afterSearch });
    };
    addNewClient = client => {
        if (client.length === 0) {
            alert('empty');
            return;
        } else {
            console.log(client);
            this.closeModal();
        }
    };
    handleChange = e => {
        this.setState({ searchValue: e.target.value });
        if (e.target.value.length === 0) {
            this.setState({ clientsList: clientsArray });
        }
    };
    componentDidMount() {
        this.setState({
            isInitialFetching: false,
            clientsList: clientsArray,
        });
    }
    componentDidUpdate(prevProps, prevState) {
        const { currentTeam, history } = this.props;
        if (!prevProps.currentTeam.data.id && this.props.currentTeam.data.id) {
            if (!checkIsAdminByRole(currentTeam.data.role)) {
                history.push('/timer');
            }
        }
    }

    render() {
        const { isInitialFetching, showModal, searchValue, editedItem, clientsList } = this.state;
        const { vocabulary, isMobile, currentTeam } = this.props;
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
                            <div className="clients_list_item list-header">
                                <div className="client_name">Client Name</div>
                                <div className="client_list_item_right_container">
                                    <div className="client_time">Total Time</div>
                                </div>
                            </div>
                            {clientsList.map((item, index) => (
                                <div className="clients_list_item" key={item.id}>
                                    <div className="client_name">{item.name}</div>
                                    <div className="client_list_item_right_container">
                                        <div className="client_time">{item.totalTime}</div>
                                        <div className="client_edit_container">
                                            <i
                                                className="client_delete"
                                                onClick={() =>
                                                    this.setState({ editedItem: clientsList[index], showModal: true })
                                                }
                                            />
                                        </div>
                                    </div>
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
});

export default withRouter(connect(mapStateToProps)(ClientsPage));
