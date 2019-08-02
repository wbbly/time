import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import classNames from 'classnames';
import openSocket from 'socket.io-client';
import * as moment from 'moment';

// Services
import { getTimeDiff } from '../../services/timeService';
import { getTokenFromLocalStorage } from '../../services/tokenStorageService';
import { apiCall } from '../../services/apiService';
import { decodeTimeEntryIssue } from '../../services/timeEntryService';
import { logoutByUnauthorized } from '../../services/authentication';

// Components
import TeamSwitcher from '../TeamSwitcher';
import UserMenu from '../UserMenu';

// Actions
import {
    setServerClientTimediffAction,
    setCurrentTimerAction,
    resetCurrentTimerAction,
} from '../../actions/MainPageAction';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class LeftBar extends Component {
    ONE_SECOND_PERIOD = 1000; // in ms

    state = {
        timer: '',
    };

    initSocketConnection = () => {
        const { setServerClientTimediffAction, setCurrentTimerAction, resetCurrentTimerAction } = this.props;

        this.socketConnection = openSocket(AppConfig.apiURL);
        this.socketConnection.on('connect', () => {
            this.socketConnection.emit(
                'join-v2',
                {
                    token: `Bearer ${getTokenFromLocalStorage()}`,
                },
                _ => {
                    this.socketConnection.emit('check-timer-v2', {
                        token: `Bearer ${getTokenFromLocalStorage()}`,
                    });
                }
            );
        });

        this.socketConnection.on('check-timer-v2', data => {
            if (data) {
                apiCall(AppConfig.apiURL + 'time/current', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(
                    result => {
                        setServerClientTimediffAction(+moment(result.timeISO) - +moment());
                        const currentTimer = {
                            timeStart: +moment(data.startDatetime),
                            issue: decodeTimeEntryIssue(data.issue),
                            project: data.project,
                        };
                        setCurrentTimerAction(currentTimer);
                    },
                    err => {
                        if (err instanceof Response) {
                            err.text().then(errorMessage => console.log(errorMessage));
                        } else {
                            console.log(err);
                        }
                    }
                );
            } else {
                resetCurrentTimerAction();
            }
        });
        this.socketConnection.on('stop-timer-v2', data => {
            resetCurrentTimerAction();
        });
        this.socketConnection.on('user-unauthorized', data => logoutByUnauthorized());
    };

    componentDidMount() {
        const { location } = this.props;
        if (location.pathname !== '/timer') {
            this.initSocketConnection();
        }
        this.activeSmalltimer();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.props.location.pathname === '/timer'
                ? this.socketConnection && this.socketConnection.emit('leave') && this.socketConnection.close()
                : this.socketConnection
                    ? !this.socketConnection.connected && this.initSocketConnection()
                    : this.initSocketConnection();
        }
    }

    componentWillUnmount() {
        this.socketConnection && this.socketConnection.emit('leave') && this.socketConnection.close();
    }

    activeSmalltimer() {
        setInterval(() => this.getTimeNow(), this.ONE_SECOND_PERIOD);
    }

    getTimeNow() {
        const { currentTimer } = this.props;
        if (!currentTimer.timeStart) {
            this.setState({ timer: '' });

            return false;
        }

        this.setState({ timer: getTimeDiff(currentTimer.timeStart, true) });
    }

    visualTimer() {
        if (!!this.state.timer && window.location.pathname !== '/timer') {
            return this.state.timer;
        }
    }

    render() {
        const { switchMenu, isMobile, vocabulary } = this.props;
        const { v_timer, v_reports, v_projects, v_team } = vocabulary;
        return (
            <div className={classNames('wrapper', { 'wrapper--mobile': isMobile })}>
                {!isMobile && (
                    <Link onClick={switchMenu} to="/timer">
                        <i className="logo_small" />
                    </Link>
                )}

                <div className="navigation_links_container">
                    <Link onClick={switchMenu} to="/timer" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="timer" />
                            <div className="links_text">{v_timer}</div>
                            <div className="timer_task">{this.visualTimer()}</div>
                        </div>
                    </Link>
                    <Link onClick={switchMenu} to="/reports/summary" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="reports" />
                            <div className="links_text">{v_reports}</div>
                        </div>
                    </Link>
                    <Link onClick={switchMenu} to="/projects" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="projects" />
                            <div className="links_text">{v_projects}</div>
                        </div>
                    </Link>
                    <div className="wrapper-position-add-team">
                        <Link onClick={switchMenu} to="/team" style={{ textDecoration: 'none' }}>
                            <div className="navigation_links">
                                <i className="team" />
                                <div className="links_text">{v_team}</div>
                            </div>
                        </Link>
                        <TeamSwitcher isMobile={isMobile} />
                    </div>
                </div>
                <UserMenu switchMenu={switchMenu} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentTimer: state.mainPageReducer.currentTimer,
});

const mapDispatchToProps = {
    setServerClientTimediffAction,
    setCurrentTimerAction,
    resetCurrentTimerAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LeftBar)
);
