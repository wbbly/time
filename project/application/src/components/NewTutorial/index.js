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

    render() {
        const { isMobile } = this.props;
        return (
            <>
                {isMobile ? (
                    <div>Mobile</div>
                ) : (
                    <DesctopTutorial nextPage={this.nextPage} prevPage={this.prevPage} step={this.state.step} />
                )}
            </>
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
