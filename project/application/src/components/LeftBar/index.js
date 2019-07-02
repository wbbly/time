import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Services
import { getTimeDiff } from '../../services/timeService';
import { getCurrentTimerFromLocalStorage } from '../../services/currentTimerStorageService';
import { Trans } from 'react-i18next';


// Components
import TeamSwitcher from '../TeamSwitcher';

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
        return logoutByUnauthorized();
    }

    render() {
        const { switchMenu, isMobile, teamsUpdateTimestamp } = this.props;
        return (
            <div className="wrapper" onClick={switchMenu}>
                {!isMobile && (
                    <Link to="/timer">
                        <i className="logo_small" />
                    </Link>
                )}

                <div className="navigation_links_container">
                    <Link to="/timer" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="timer" />
                            <div className="links_text">
                                <Trans i18nKey="timer">timer</Trans>
                            </div>
                            <div className="timer_task">{this.visualTimer()}</div>
                        </div>
                    </Link>
                    <Link to="/reports/summary" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="reports" />
                            <div className="links_text">
                                <Trans i18nKey="reports">reports</Trans>
                            </div>
                        </div>
                    </Link>
                    <Link to="/projects" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="projects" />
                            <div className="links_text">
                                <Trans i18nKey="projects">projects</Trans>
                            </div>
                        </div>
                    </Link>
                    <Link to="/team" style={{ textDecoration: 'none' }}>
                        <div className="navigation_links">
                            <i className="team" />
                            <div className="links_text">
                                <Trans i18nKey="team">team</Trans>
                            </div>
                        </div>
                    </Link>
                    <TeamSwitcher isMobile={isMobile} teamsUpdateTimestamp={teamsUpdateTimestamp} />
                </div>

                <div className="logout_container" onClick={e => this.logout()}>
                    <div>
                        <i className="logout" />
                        <span>
                            <Trans i18nKey="log_out">Log out</Trans>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default LeftBar;
