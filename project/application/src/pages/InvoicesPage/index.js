import React, {Component} from 'react';

// Styles
import './style.scss';
import {Loading} from "../../components/Loading";

class InvoicesPage extends Component {

    state = {
        isInitialFetching: true,
    };

    componentDidMount() {
        setTimeout(() => this.setState({isInitialFetching: false}), 500)
    }

    render() {
        const {vocabulary} = this.props;
        const {v_invoices} = vocabulary;
        const {isInitialFetching} = this.state;
        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <div>Invoices</div>
            </Loading>
        );
    }
}

export default InvoicesPage;
