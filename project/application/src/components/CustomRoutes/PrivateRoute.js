import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { getUserDataAction, checkUserDataAction } from '../../actions/UserActions';
import { checkAppVersion, logoutByUnauthorized } from '../../services/authentication';

import { Loading } from '../Loading';

class PrivateRoute extends Component {
    componentDidMount() {
        const { getUserDataAction } = this.props;

        if (!checkAppVersion()) {
            return logoutByUnauthorized();
        }

        getUserDataAction();
    }

    componentDidUpdate(prevProps, prevState) {
        const { checkUserDataAction } = this.props;

        if (!checkAppVersion()) return logoutByUnauthorized();

        if (prevProps.location.pathname !== this.props.location.pathname) {
            checkUserDataAction();
        }
    }

    render() {
        const { render, user, isFetching, isInitialFetching, ...rest } = this.props;

        return (
            <Route
                {...rest}
                render={props => {
                    return isInitialFetching || isFetching || user ? (
                        <Loading flag={isInitialFetching || isFetching} children={render} />
                    ) : (
                        <Redirect to="/login" />
                    );
                }}
            />
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    isFetching: state.userReducer.isFetching,
    isInitialFetching: state.userReducer.isInitialFetching,
});

const mapDispatchToProps = {
    getUserDataAction,
    checkUserDataAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrivateRoute);
