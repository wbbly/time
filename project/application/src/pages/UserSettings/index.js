import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import userSettingAction from '../../actions/UserSettingAction';

//Components
import ChangePasswordModal from '../../components/ChangePasswordModal';

//Services
import {
    getLoggedUserId,
    getTokenFromLocalStorage,
    setTokenToLocalStorage,
    getLoggedUser,
} from '../../services/tokenStorageService';
import { apiCall } from '../../services/apiService';

//Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class UserSetting extends Component {
    changeUserSetting = (username, email) => {
        const { vocabulary } = this.props;
        const { v_a_data_updated_ok } = vocabulary;

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
                    alert(v_a_data_updated_ok);
                    this.updateUserData();
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
        this.setDataToForm();
    }

    render() {
        const { vocabulary, userSettingAction } = this.props;
        const { v_my_profile, v_your_name, v_save_changes, v_change_password } = vocabulary;
        return (
            <div className="wrapper_user_setting_page">
                {this.props.userSettingReducer.changePasswordModal && (
                    <ChangePasswordModal userSettingAction={userSettingAction} />
                )}
                <div className="data_container">
                    <div className="header_user_setting">
                        <div>{v_my_profile}</div>
                        <button onClick={e => this.openChangePasswordModal()}>{v_change_password}</button>
                    </div>
                    <div className="body_user_setting">
                        <div className="column">{/*<i className="rectangle" />*/}</div>
                        <div className="column">
                            <div className="input_container">
                                <div className="input_title">{v_your_name}</div>
                                <input ref={input => (this.username = input)} type="text" />
                            </div>
                            <div className="input_container">
                                <div className="input_title">E-Mail</div>
                                <input ref={input => (this.userEmail = input)} type="text" />
                            </div>
                            <button onClick={e => this.changeUserSetting(this.username.value, this.userEmail.value)}>
                                {v_save_changes}
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

    setDataToForm = () => {
        this.updateUserData();
    };

    updateUserData = () => {
        const USER = getLoggedUser();
        this.username.value = USER.username;
        this.userEmail.value = USER.email;
    };
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