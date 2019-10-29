import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

// Components
import { Loading } from '../../components/Loading';

// Actions

// Styles
import './style.scss';

class ClientsPage extends Component {
    state = {
        isInitialFetching: true,
        etalonArr: [],
    };
    componentDidMount() {
        this.setState({ isInitialFetching: false });
    }
    render() {
        const { isInitialFetching } = this.state;
        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <div
                    className={classNames('wrapper_clients_page', {
                        'wrapper_clients_page--mobile': false,
                    })}
                >
                    <div className="data_container_clients_page">
                        <div className="clients_page_header">
                            <div className="clients_page_title">Clients</div>
                            {true && <button className="add_client_button">Add client</button>}
                        </div>
                    </div>
                </div>
            </Loading>
        );
    }
}
export default ClientsPage;
