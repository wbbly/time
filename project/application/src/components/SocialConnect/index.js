import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import { SocialConnectButton } from '../SocialConnectButton';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

// Actions
import { checkUserDataAction } from '../../actions/UserActions';
import { showNotificationAction } from '../../actions/NotificationActions';

// axios requests
import { setSocialConnect } from '../../configAPI';

// app config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class SocialConnect extends Component {
    state = {
        isFetchingFacebook: false,
    };
    setValueToState = (key, value) =>
        this.setState({
            [key]: value,
        });

    responseFacebook = async response => {
        const { showNotificationAction, vocabulary, checkUserDataAction } = this.props;

        if (response.status !== 'unknown') {
            const { user } = this.props;
            const { id } = response;

            try {
                await setSocialConnect(user.id, { socialId: id, socialName: 'facebook' });
                await checkUserDataAction();
            } catch (error) {
                const textError = error.response.data.message;
                showNotificationAction({ text: vocabulary[textError], type: 'error' });
            } finally {
                this.setState({
                    isFetchingFacebook: false,
                });
            }
        }
        this.setState({
            isFetchingFacebook: false,
        });
    };

    render() {
        const { isFetchingFacebook } = this.state;

        const { social, checkUserDataAction } = this.props;
        const { facebookId, linkedinId, googleId } = social;

        const socialButtons = [
            {
                type: 'facebook',
                textButton: 'Facebook',
                disabled: false,
                connected: Boolean(facebookId),
            },
            {
                type: 'linkedin',
                textButton: 'LinkedIn',
                disabled: true,
                connected: Boolean(linkedinId),
            },
            {
                type: 'google',
                textButton: 'Google',
                disabled: true,
                connected: Boolean(googleId),
            },
        ];

        return (
            <div className="social-connect-wrapper">
                {socialButtons.map(button => {
                    const { type, disabled, textButton, connected } = button;
                    const { user } = this.props;
                    if (type === 'facebook') {
                        return (
                            <FacebookLogin
                                key={type}
                                appId={AppConfig.socialAuth.fbAppId}
                                autoLoad={false}
                                fields="name,email"
                                callback={this.responseFacebook}
                                render={renderProps => (
                                    <SocialConnectButton
                                        onClick={async event => {
                                            if (isFetchingFacebook) return;
                                            this.setState({ isFetchingFacebook: true });
                                            if (facebookId) {
                                                await setSocialConnect(user.id, {
                                                    socialId: null,
                                                    socialName: 'facebook',
                                                });
                                                await checkUserDataAction();
                                                this.setState({ isFetchingFacebook: false });
                                                return;
                                            }
                                            renderProps.onClick(event);
                                        }}
                                        connected={connected}
                                        type={type}
                                        isFetching={isFetchingFacebook || renderProps.isDisabled}
                                        disabled={disabled}
                                        textButton={textButton}
                                    />
                                )}
                            />
                        );
                    }
                    return (
                        <SocialConnectButton
                            key={type}
                            connected={connected}
                            type={type}
                            disabled={disabled}
                            textButton={textButton}
                        />
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    social: state.userReducer.user.social,
    vocabulary: state.languageReducer.vocabulary,
    user: state.userReducer.user,
});

const mapDispatchToProps = {
    checkUserDataAction,
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SocialConnect);
