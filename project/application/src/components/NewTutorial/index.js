import React from 'react';
import Swipe from 'react-easy-swipe';
import { connect } from 'react-redux';

import { tutorialChecked } from '../../configAPI';
import { changeUserData } from '../../actions/UserActions';

import DesctopTutorial from '../desctopTutorial';

import './style.scss';

class NewTutorial extends React.Component {
    state = {
        dStep: 0,
        mStep: 0,
    };

    nextPage = () => {
        this.props.isMobile
            ? this.setState({ mStep: this.state.mStep === 5 ? 5 : this.state.mStep + 1 })
            : this.setState({ dStep: this.state.dStep === 4 ? 4 : this.state.dStep + 1 });
    };
    prevPage = () => {
        this.props.isMobile
            ? this.setState({ mStep: this.state.mStep === 0 ? 0 : this.state.mStep - 1 })
            : this.setState({ dStep: this.state.dStep === 0 ? 0 : this.state.dStep - 1 });
    };

    finishTutorial = async () => {
        const { user, changeUserData } = this.props;
        try {
            let res = await tutorialChecked(user.id, false);
            changeUserData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const { isMobile } = this.props;
        return isMobile ? (
            <Swipe onSwipeLeft={this.nextPage} onSwipeRight={this.prevPage}>
                <DesctopTutorial
                    dStep={this.state.dStep}
                    mStep={this.state.mStep}
                    finish={this.finishTutorial}
                    isMobile={isMobile}
                />
            </Swipe>
        ) : (
            <DesctopTutorial
                nextPage={this.nextPage}
                prevPage={this.prevPage}
                dStep={this.state.dStep}
                mStep={this.state.mStep}
                finish={this.finishTutorial}
                isMobile={isMobile}
            />
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
)(NewTutorial);
