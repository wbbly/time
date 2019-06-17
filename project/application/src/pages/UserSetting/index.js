import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import userSettingAction from '../../actions/UserSettingAction';

//Components
import LeftBar from '../../components/LeftBar';
import ChangePasswordModal from '../../components/ChangePasswordModal';

//Services
import { getLoggedUserId, getTokenFromLocalStorage, setTokenToLocalStorage } from '../../services/tokenStorageService';
import { apiCall } from '../../services/apiService';

//Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class UserSetting extends Component {
    changeUserSetting = (username, email) => {
        const USER_ID = getLoggedUserId();
        apiCall(AppConfig.apiURL + `user/${USER_ID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
            },
            body: JSON.stringify({
                email,
                username,
            }),
        }).then(
            result => {
                if (result.token) {
                    setTokenToLocalStorage(result.token);
                }
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => {
                        alert(JSON.parse(errorMessage).message);
                    });
                } else {
                    console.log(err);
                }
            }
        );
    };

    componentDidMount() {
        this.username.value = this.props.userSettingReducer.userName;
        this.userEmail.value = this.props.userSettingReducer.userEmail;
    }

    render() {
        return (
            <div className="wrapper_user_setting_page">
                {this.props.userSettingReducer.changePasswordModal && (
                    <ChangePasswordModal userSettingAction={this.props.userSettingAction} />
                )}
                <LeftBar />
                <div className="data_container">
                    <div className="header_user_setting">
                        <div>My Profile</div>
                        <button onClick={e => this.openChangePasswordModal()}>Change password</button>
                    </div>
                    <div className="body_user_setting">
                        <div className="column">
                            <i className="rectangle" />
                        </div>
                        <div className="column">
                            <div className="input_container">
                                <div className="input_title">Your name</div>
                                <input ref={input => (this.username = input)} type="text" />
                            </div>
                            <div className="input_container">
                                <div className="input_title">E-Mail</div>
                                <input ref={input => (this.userEmail = input)} type="text" />
                            </div>
                            <button onClick={e => this.changeUserSetting(this.username.value, this.userEmail.value)}>
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    openChangePasswordModal() {
        this.props.userSettingAction('TOGGLE_MODAL', true);
    }
}

const mapStateToProps = store => {
    return {
        userSettingReducer: store.userSettingReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userSettingAction: (actionType, action) => dispatch(userSettingAction(actionType, action))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSetting);
