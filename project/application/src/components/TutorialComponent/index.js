import React, { Component } from 'react';
import Swipe from 'react-easy-swipe';
import { connect } from 'react-redux';

import { tutorialChecked } from '../../configAPI';
import { changeUserData } from '../../actions/UserActions';

import './style.scss';
import slide1 from '../../images/tutorial/Onboarding1.png';
import slide2 from '../../images/tutorial/Onboarding2.png';
import slide3 from '../../images/tutorial/Onboarding3.png';
import slide4 from '../../images/tutorial/Onboarding4.png';
import slide5 from '../../images/tutorial/Onboarding5.png';
import slide6 from '../../images/tutorial/Onboarding6.png';

class TutorialComponent extends Component {
    state = {
        swipedTarget: null,
        swipedElements: [],
    };

    onSwipeLeft = (event = {}) => {
        const { swipedTarget, swipedElements } = this.state;
        if (swipedTarget) {
            swipedTarget.classList.add('swiped');
            swipedElements.push(swipedTarget);
            this.setState({ swipedElements });
        } else {
            const swipe = event.currentTarget;
            swipe.classList.add('swiped');
            swipedElements.push(swipe);
            this.setState({ swipedElements });
        }
    };

    toggleSwipe = event => {
        this.setState({ swipedTarget: event.currentTarget });
    };

    restartTutorial = () => {
        this.state.swipedElements.forEach(elem => elem.classList.remove('swiped'));
        this.setState({ swipedElements: [] });
    };

    finishTutorial = async () => {
        const { user, changeUserData } = this.props;
        try {
            let res = await tutorialChecked(user.id, true);
            changeUserData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const { user, isMobile, children } = this.props;

        return !user.onboardingMobile && isMobile ? (
            <div className="tutorial-container">
                <div className="tutorial-wrapper">
                    <div className="slide" style={{ backgroundImage: `url(${slide6})` }}>
                        <i className="arrow-back" onClick={this.restartTutorial} />
                        <div className="slide-title">
                            <h1>Use wobbly with pleasure</h1>
                            <button onClick={this.finishTutorial}>Get started</button>
                        </div>
                    </div>
                    <Swipe
                        className="swiped-elem"
                        onSwipeStart={this.toggleSwipe}
                        onSwipeLeft={this.onSwipeLeft}
                        onClick={e => {
                            if (e.target.className !== 'skip-link') {
                                this.onSwipeLeft(e);
                            }
                        }}
                    >
                        <div className="slide" style={{ backgroundImage: `url(${slide5})` }}>
                            <a href="# " onClick={this.finishTutorial} className="skip-link">
                                Skip tutorial
                            </a>
                            <div className="instruction" style={{ bottom: '10%', right: '8%' }}>
                                <p>Stop the timer when complete the task.</p>
                                <i className="arrow-tutorial" />
                            </div>
                        </div>
                    </Swipe>
                    <Swipe
                        className="swiped-elem"
                        onSwipeStart={this.toggleSwipe}
                        onSwipeLeft={this.onSwipeLeft}
                        onClick={e => {
                            if (e.target.className !== 'skip-link') {
                                this.onSwipeLeft(e);
                            }
                        }}
                    >
                        <div className="slide" style={{ backgroundImage: `url(${slide4})` }}>
                            <a href="# " onClick={this.finishTutorial} className="skip-link">
                                Skip tutorial
                            </a>
                            <div className="instruction" style={{ top: '47%', right: '0%' }}>
                                <p style={{ width: '80%' }}>You are ready to start, click on the play button.</p>
                                <i className="arrow-tutorial" />
                            </div>
                        </div>
                    </Swipe>
                    <Swipe
                        className="swiped-elem"
                        onSwipeStart={this.toggleSwipe}
                        onSwipeLeft={this.onSwipeLeft}
                        onClick={e => {
                            if (e.target.className !== 'skip-link') {
                                this.onSwipeLeft(e);
                            }
                        }}
                    >
                        <div className="slide" style={{ backgroundImage: `url(${slide3})` }}>
                            <a href="# " onClick={this.finishTutorial} className="skip-link">
                                Skip tutorial
                            </a>
                            <div className="instruction" style={{ top: '37%', right: '13%' }}>
                                <p>Choose or create your project.</p>
                                <i className="arrow-tutorial" />
                            </div>
                        </div>
                    </Swipe>
                    <Swipe
                        className="swiped-elem"
                        onSwipeStart={this.toggleSwipe}
                        onSwipeLeft={this.onSwipeLeft}
                        onClick={e => {
                            if (e.target.className !== 'skip-link') {
                                this.onSwipeLeft(e);
                            }
                        }}
                    >
                        <div className="slide" style={{ backgroundImage: `url(${slide2})` }}>
                            <a href="# " onClick={this.finishTutorial} className="skip-link">
                                Skip tutorial
                            </a>
                            <div className="instruction" style={{ top: '26%', right: '13%' }}>
                                <p>Enter the name of your task.</p>
                                <i className="arrow-tutorial" />
                            </div>
                        </div>
                    </Swipe>
                    <Swipe
                        className="swiped-elem"
                        onSwipeStart={this.toggleSwipe}
                        onSwipeLeft={this.onSwipeLeft}
                        onClick={e => {
                            if (e.target.className !== 'skip-link') {
                                this.onSwipeLeft(e);
                            }
                        }}
                    >
                        <div className="slide" style={{ backgroundImage: `url(${slide1})` }}>
                            <a href="# " onClick={this.finishTutorial} className="skip-link">
                                Skip tutorial
                            </a>
                            <div className="slide-title">
                                <h1>Wellcome to wobbly!</h1>
                                <p>Begin to track your time now</p>
                            </div>
                            <div className="instruction" style={{ bottom: '14%', right: '10%' }}>
                                <p>To start the timer click on the play button</p>
                                <i className="arrow-tutorial" />
                            </div>
                        </div>
                    </Swipe>
                </div>
            </div>
        ) : (
            children
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    changeUserData,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TutorialComponent);
