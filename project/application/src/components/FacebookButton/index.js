import React, { Component } from 'react';
import { connect } from 'react-redux';

import FacebookLogin from 'react-facebook-login';

import { loginWithFacebook } from '../../configAPI';

import { setTokenToLocalStorage } from '../../services/tokenStorageService';

import './style.scss';

const FacebookIcon = () => (
    <svg
        className="facebook-icon"
        width="20"
        height="20"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M25 4.16694C25 1.9775 23.0233 0 20.8333 0H4.16667C1.97667 0 0 1.9775 0 4.16694V20.8331C0 23.0225 1.97667 25 4.16694 25H12.5V15.5556H9.44444V11.3889H12.5V9.76556C12.5 6.96583 14.6022 4.44444 17.1875 4.44444H20.5556V8.61111H17.1875C16.8189 8.61111 16.3889 9.05861 16.3889 9.72889V11.3889H20.5556V15.5556H16.3889V25H20.8333C23.0233 25 25 23.0225 25 20.8331V4.16694Z"
            fill="white"
        />
    </svg>
);

class FacebookButton extends Component {
    responseFacebook = async response => {
        const { vocabulary, setHaveToken } = this.props;

        if (response.status !== 'unknown') {
            const { email, id, name } = response;
            try {
                const response = await loginWithFacebook({ email, id, name });
                const { token } = response.data;
                setTokenToLocalStorage(token);
                document.cookie = 'isAuthWobbly=true; path=/; domain=.wobbly.me;';
                setHaveToken();
            } catch (error) {
                const textError = error.response.data.message;
                alert(vocabulary[textError]);
            }
        }
    };

    render() {
        const { vocabulary } = this.props;
        const { v_login_with } = vocabulary;

        return (
            <FacebookLogin
                textButton={`${v_login_with} Facebook`}
                icon={<FacebookIcon />}
                cssClass="facebook-button"
                appId="543553739782396"
                autoLoad={false}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook}
            />
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(FacebookButton);
