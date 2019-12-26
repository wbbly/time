import React from 'react';
import Swipe from 'react-easy-swipe';
import { connect } from 'react-redux';

import { tutorialChecked } from '../../configAPI';
import { changeUserData } from '../../actions/UserActions';

import DesctopTutorial from '../desctopTutorial';

import './style.scss';

class NewTutorial extends React.Component {
    state = {
        step: 0,
    };

    nextPage = () => {
        this.setState({ step: this.state.step === 4 ? 4 : this.state.step + 1 });
    };
    prevPage = () => {
        this.setState({ step: this.state.step === 0 ? 0 : this.state.step - 1 });
    };

    finishTutorial = async () => {
        const { user, changeUserData } = this.props;
        try {
            let res = await tutorialChecked(user.id, true); //change to false on push
            changeUserData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const { isMobile, user, children } = this.props;
        if (user.onboardingMobile && isMobile) return <div>Mobile</div>;
        if (user.onboardingMobile && !isMobile)
            return (
                <DesctopTutorial
                    nextPage={this.nextPage}
                    prevPage={this.prevPage}
                    step={this.state.step}
                    finish={this.finishTutorial}
                />
            );
        return children;
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
)(NewTutorial);
