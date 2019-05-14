import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';
import { getTimeDiff } from '../../services/timeService';
import { removeUserFromLocalStorage } from '../../services/userStorageService';
import {
    removeCurrentTimerFromLocalStorage,
    getCurrentTimerFromLocalStorage,
} from '../../services/currentTimerStorageService';
import { removeServerClientTimediffFromLocalStorage } from '../../services/serverClientTimediffStorageService';
import TeamSwitcher from '../TeamSwitcher';

class LeftBar extends Component {
    ONE_SECOND_PERIOD = 1000; // in ms

    componentDidMount() {
        this.setState({ timeEntriesList: this.props.timeEntriesList });
        this.activeSmalltimer();
    }

    state = {
        timer: '',
    };

    activeSmalltimer() {
        setInterval(() => this.getTimeNow(), this.ONE_SECOND_PERIOD);
    }

    getTimeNow() {
        let timer = getCurrentTimerFromLocalStorage();
        if (!timer.timeStart) {
            this.setState({ timer: '' });

            return;
        }

        this.setState({ timer: getTimeDiff(timer.timeStart, true) });
    }

    visualTimer() {
        if (!!this.state.timer && window.location.pathname !== '/timer') {
            return this.state.timer;
        }
    }

    logout() {
        removeUserFromLocalStorage();
        removeCurrentTimerFromLocalStorage();
        removeServerClientTimediffFromLocalStorage();
        window.location.href = window.location.origin;
    }

    render() {
        return (
            <div className="wrapper">
                <i className="logo_small" />
                <div className="navigation_links_container">
                    <Link to="/timer" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="timer" />
                            <div className="links_text">timer</div>
                            <div className="timer_task">{this.visualTimer()}</div>
                        </div>
                    </Link>
                    <Link to="/reports" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="reports" />
                            <div className="links_text">reports</div>
                        </div>
                    </Link>
                    <Link to="/projects" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="projects" />
                            <div className="links_text">projects</div>
                        </div>
                    </Link>
                    <Link to="/team" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="team" />
                            <div className="links_text">team</div>
                        </div>
                    </Link>

                    <div className="navigation_links">
                        <i className="workspaces" />
                        <div className="links_text">workspaces</div>
                    </div>
                    <TeamSwitcher />
                </div>

                <div className="logout_container" onClick={e => this.logout()}>
                    <i className="logout" />
                    <span>Log out</span>
                </div>
            </div>
        );
    }
}

export default LeftBar;
