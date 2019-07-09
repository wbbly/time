import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Services
import { getTimeDiff } from '../../services/timeService';
import { getCurrentTimerFromLocalStorage } from '../../services/currentTimerStorageService';

// Components
import TeamSwitcher from '../TeamSwitcher';
import UserMenu from '../UserMenu';

// Actions

// Queries

// Config

// Styles
import './style.css';
import { logoutByUnauthorized } from '../../services/authentication';

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

            return false;
        }

        this.setState({ timer: getTimeDiff(timer.timeStart, true) });
    }

    visualTimer() {
        if (!!this.state.timer && window.location.pathname !== '/timer') {
            return this.state.timer;
        }
    }

    logout() {
        return logoutByUnauthorized();
    }

    render() {
        const { switchMenu, isMobile, teamsUpdateTimestamp, vocabulary } = this.props;
        const { v_timer, v_reports, v_projects, v_team } = vocabulary;
        return (
            <div className="wrapper">
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
                        <TeamSwitcher isMobile={isMobile} teamsUpdateTimestamp={teamsUpdateTimestamp} />
                    </div>
                </div>
                <UserMenu switchMenu={switchMenu} />
            </div>
        );
    }
}

export default LeftBar;
