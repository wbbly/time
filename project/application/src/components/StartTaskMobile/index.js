import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import { setSwipedTaskAction } from '../../actions/ResponsiveActions';

// Components
import { Loading } from '../Loading';
import StartEditTaskModal from '../StartEditTaskModal';
import ModalPortal from '../ModalPortal';

// Services
import { getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { stopTimerSocket } from '../../configSocket';

// Styles
import './style.scss';

const PlayIcon = ({ className, onClick }) => (
    <svg className={className} onClick={onClick} viewBox="24 20 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d)">
            <circle cx="49" cy="45" r="25" fill="#27AE60" />
        </g>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M58.1441 43.4936L45.7085 35.1956C45.3409 34.9638 44.8844 35.0024 44.5396 35.0024C43.1606 35.0024 43.1667 36.13 43.1667 36.4157V53.3759C43.1667 53.6174 43.1606 54.7893 44.5396 54.7893C44.8844 54.7893 45.341 54.8277 45.7085 54.596L58.144 46.2981C59.1647 45.6549 58.9884 44.8958 58.9884 44.8958C58.9884 44.8958 59.1648 44.1367 58.1441 43.4936Z"
            fill="white"
        />
        <defs>
            <filter
                id="filter0_d"
                x="0"
                y="0"
                width="98"
                height="98"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="12" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
        </defs>
    </svg>
);

const StopIcon = ({ className, onClick }) => (
    <svg className={className} onClick={onClick} viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="23.5" cy="23.5" r="23.5" fill="#EB5757" />
        <rect x="15.6666" y="15.6666" width="15.6667" height="15.6667" rx="2" fill="white" />
    </svg>
);

class StartTaskMobile extends Component {
    state = {
        isStoppingTask: false,
        showModal: false,
    };

    handleStopTask = event => {
        this.setState(
            {
                isStoppingTask: true,
            },
            () => stopTimerSocket()
        );
    };

    handleStartTask = event => {
        const { setSwipedTaskAction } = this.props;
        setSwipedTaskAction(null);
        this.setState({
            showModal: true,
        });
    };

    disableShowModal = event =>
        this.setState({
            showModal: false,
        });

    componentDidUpdate(prevProps, prevState) {
        const { timerTick, currentTimer } = this.props;

        if (prevProps.timerTick !== timerTick) {
            if (prevProps.timerTick && !timerTick) {
                this.setState({
                    isStoppingTask: false,
                });
            }
        }

        if (!_.isEqual(prevProps.currentTimer, currentTimer)) {
            if (!prevProps.currentTimer && currentTimer) {
                this.disableShowModal();
            }
        }
    }

    render() {
        const { isStoppingTask, showModal } = this.state;
        const { timerTick, currentTimer, durationTimeFormat, isMobile } = this.props;

        return (
            isMobile &&
            (currentTimer ? (
                <div className="current-task-mobile">
                    <div className="current-task-mobile__task-info">
                        <div className="current-task-mobile__task-timer">
                            {timerTick ? timerTick : getTimeDurationByGivenTimestamp(0, durationTimeFormat)}
                        </div>
                        <div className="current-task-mobile__task-name">{currentTimer.issue}</div>
                    </div>
                    <Loading mode="overlay" flag={isStoppingTask} withLogo={false} width="50px" height="50px">
                        <StopIcon className="current-task-mobile__stop-icon" onClick={this.handleStopTask} />
                    </Loading>
                </div>
            ) : (
                <>
                    {showModal ? (
                        <ModalPortal>
                            <StartEditTaskModal disableShowModal={this.disableShowModal} />
                        </ModalPortal>
                    ) : (
                        <PlayIcon className="play-icon-large-mobile" onClick={this.handleStartTask} />
                    )}
                </>
            ))
        );
    }
}

const mapStateToProps = state => ({
    currentTimer: state.mainPageReducer.currentTimer,
    timerTick: state.mainPageReducer.timerTick,
    durationTimeFormat: state.userReducer.durationTimeFormat,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    setSwipedTaskAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StartTaskMobile);
