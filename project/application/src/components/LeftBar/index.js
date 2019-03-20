import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { getDateInString } from '../../pages/MainPage/timeInSecondsFunction';

class LeftBar extends Component {
    componentDidMount() {
        this.setState({ arrTasks: this.props.arrTasks });
    }

    state = {
        timer: '',
    };

    activeSmalltimer() {
        setInterval(() => {
            this.getTimeNow();
        }, 1000);
    }

    getTimeNow() {
        let timer = JSON.parse(localStorage.getItem('LT'));
        if (!timer || !timer.timeStart) {
            return;
        }
        let timeOnTimer = +new Date() - timer.timeStart;
        this.setState({ timer: getDateInString(timeOnTimer) });
    }

    visualTimer() {
        if (!!this.state.timer && window.location.pathname !== '/main-page') {
            return this.state.timer;
        }
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
            </div>
        );
    }
    componentDidMount() {
        this.activeSmalltimer();
    }
}

export default LeftBar;
