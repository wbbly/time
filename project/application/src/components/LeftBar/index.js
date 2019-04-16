import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';
import { getTimeDiff } from '../../pages/MainPage/timeInSecondsFunction';

class LeftBar extends Component {
    ONE_SECOND = 1000; // in ms

    componentDidMount() {
        this.setState({ arrTasks: this.props.arrTasks });
        this.activeSmalltimer();
    }

    state = {
        timer: '',
    };

    activeSmalltimer() {
        setInterval(() => this.getTimeNow(), this.ONE_SECOND);
    }

    getTimeNow() {
        let timer = JSON.parse(localStorage.getItem('current-timer'));
        if (!timer || !timer.timeStart) {
            this.setState({ timer: '' });

            return;
        }

        this.setState({ timer: getTimeDiff(timer.timeStart, true) });
    }

    visualTimer() {
        if (!!this.state.timer && window.location.pathname !== '/main-page') {
            return this.state.timer;
        }
    }

    logout() {
        localStorage.removeItem('user-object');
        localStorage.removeItem('current-timer');
        window.location.reload();
    }

    render() {
        return (
            <div className="wrapper">
                <i className="logo_small" />
                <div className="navigation_links_container">
                    <Link to="/main-page" style={{ textDecoration: 'none' }}>
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
