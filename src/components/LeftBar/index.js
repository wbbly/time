import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import './style.css';

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
        if (!timer) {
            return;
        }
        let timeStampClosePage = moment(timer.timerStartDateTime);
        let timeOnTimer = timer.timeOnTimer;
        let newTime = moment(timeOnTimer)
            .add(moment(moment().diff(timeStampClosePage)).format('s'), 'seconds')
            .format('HH:mm:ss')
            .split(':');
        this.setState({
            timer: moment()
                .set({ hour: newTime[0], minute: newTime[1], second: newTime[2] })
                .format('YYYY-MM-DD HH:mm:ss'),
        });
    }

    visualTimer(timer) {
        if (timer !== 'Invalid date') {
            return timer;
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
                            <div className="timer_task">
                                {this.visualTimer(moment(this.state.timer).format('HH:mm:ss'))}
                            </div>
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
