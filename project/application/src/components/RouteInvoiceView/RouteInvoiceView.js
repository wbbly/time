import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import _ from 'lodash';

import { initSocket } from '../../configSocket';

// Actions
import { setTimerTickAction, getTimeEntriesListAction } from '../../actions/MainPageAction';
import { getUserDataAction, checkUserDataAction } from '../../actions/UserActions';
import { getUserTeamsAction, getCurrentTeamAction } from '../../actions/TeamActions';

// Services
import { checkAppVersion, logoutByUnauthorized } from '../../services/authentication';
import { updatePageTitle } from '../../services/pageTitleService';

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
        const {
            checkUserDataAction,
            getUserTeamsAction,
            getCurrentTeamAction,
            user,
            currentTimer,
            setTimerTickAction,
        } = this.props;

        if (!checkAppVersion()) return logoutByUnauthorized();

        if (!prevProps.user && user) {
            initSocket();
        }

        if (!_.isEqual(prevProps.currentTimer, currentTimer)) {
            if (currentTimer) {
                // set timerTick
                if (!this.setInterval) {
                    this.setInterval = setInterval(() => {
                        setTimerTickAction();
                    }, 1000);
                }
            } else {
                // reset timerTick
                updatePageTitle(null);
                clearInterval(this.setInterval);
                this.setInterval = null;
                setTimerTickAction('reset');
            }
        }

        if (prevProps.location.pathname !== this.props.location.pathname) {
            checkUserDataAction();
            getUserTeamsAction();
            getCurrentTeamAction();
        }
    }

    componentWillUnmount() {
        updatePageTitle(null);
        clearInterval(this.setInterval);
    }

    render() {
        const { render, user, isFetching, isInitialFetching, ...rest } = this.props;

        return (
            <Route
                {...rest}
                render={props => {
                    return <Loading flag={isInitialFetching || isFetching} children={render()} />;
                }}
            />
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    isFetching: state.userReducer.isFetching,
    isInitialFetching: state.userReducer.isInitialFetching,
    currentTimer: state.mainPageReducer.currentTimer,
});

const mapDispatchToProps = {
    getUserDataAction,
    checkUserDataAction,
    getUserTeamsAction,
    getCurrentTeamAction,
    setTimerTickAction,
    getTimeEntriesListAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrivateRoute);
