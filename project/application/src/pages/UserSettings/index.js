import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

// Actions
import userSettingAction from '../../actions/UserSettingAction';

//Components
import ChangePasswordModal from '../../components/ChangePasswordModal';
import SwitchLanguage from '../../components/SwitchLanguage';
import Input from '../../components/BaseComponents/Input';

//Services
import {
    getLoggedUserId,
    getTokenFromLocalStorage,
    setTokenToLocalStorage,
    getLoggedUser,
} from '../../services/tokenStorageService';
import { apiCall } from '../../services/apiService';
import { authValidation } from '../../services/validateService';

//Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class UserSetting extends Component {
    state = {
        validEmail: true,
        inputs: {
            userName: {
                value: '',
                type: 'text',
                name: 'userName',
            },
            email: {
                value: '',
                type: 'email',
                name: 'email',
            },
        },
    };

    changeUserSetting = ({ userName, email }) => {
        const { vocabulary } = this.props;
        const { v_a_data_updated_ok, lang } = vocabulary;

        const USER_ID = getLoggedUserId();
        apiCall(AppConfig.apiURL + `user/${USER_ID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
            },
            body: JSON.stringify({
                email,
                username: userName,
                language: lang.short,
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
                        const textError = JSON.parse(errorMessage).message;
                        alert(vocabulary[textError]);
                    });
                } else {
                    console.log(err);
                }
            }
        );
    };

    onSubmitHandler = event => {
        event.preventDefault();
        const { inputs } = this.state;
        const userData = Object.keys(inputs).reduce((acc, curr) => ({ ...acc, [curr]: inputs[curr].value }), {});
        if (authValidation('email', userData.email)) {
            this.setState({ validEmail: false });
            return;
        }
        this.setState({ validEmail: true });
        this.changeUserSetting(userData);
    };

    onChangeHandler = event => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            inputs: {
                ...prevState.inputs,
                [name]: {
                    ...prevState.inputs[name],
                    value,
                },
            },
        }));
    };

    componentDidMount() {
        this.setDataToForm();
    }

    render() {
        const { vocabulary, userSettingAction, isMobile } = this.props;
        const { v_my_profile, v_your_name, v_save_changes, v_change_password } = vocabulary;

        const { validEmail, inputs } = this.state;
        const { userName, email } = inputs;

        return (
            <div className={classNames('wrapper_user_setting_page', { 'wrapper_user_setting_page--mobile': isMobile })}>
                {Object.prototype.toString.call(this.props.userSettingReducer.changePasswordModal) ===
                    '[object Boolean]' &&
                    this.props.userSettingReducer.changePasswordModal && (
                        <ChangePasswordModal userSettingAction={userSettingAction} />
                    )}
                <div className="data_container">
                    <div className="header_user_setting">
                        <div>{v_my_profile}</div>
                        <button onClick={e => this.openChangePasswordModal()}>{v_change_password}</button>
                    </div>
                    <div className="body_user_setting">
                        <div className="column">{/*<i className="rectangle" />*/}</div>
                        <form className="column" onSubmit={this.onSubmitHandler} noValidate>
                            <label className="input_container">
                                <span className="input_title">{v_your_name}</span>
                                <Input
                                    config={{
                                        value: userName.value,
                                        type: userName.type,
                                        name: userName.name,
                                        onChange: this.onChangeHandler,
                                    }}
                                />
                            </label>
                            <label className="input_container">
                                <span className="input_title">E-Mail</span>
                                <Input
                                    config={{
                                        valid: validEmail,
                                        value: email.value,
                                        type: email.type,
                                        name: email.name,
                                        onChange: this.onChangeHandler,
                                    }}
                                />
                            </label>
                            <SwitchLanguage dropdown />
                            <button type="submit">{v_save_changes}</button>
                        </form>
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
        const { username, email } = USER;
        this.setState(prevState => ({
            inputs: {
                ...prevState.inputs,
                userName: {
                    ...prevState.inputs.userName,
                    value: username,
                },
                email: {
                    ...prevState.inputs.email,
                    value: email,
                },
            },
        }));
    };
}

const mapStateToProps = state => ({
    userSettingReducer: state.userSettingReducer,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = dispatch => {
    return {
        userSettingAction: (actionType, action) => dispatch(userSettingAction(actionType, action))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSetting);
