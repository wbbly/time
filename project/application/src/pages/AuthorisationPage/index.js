import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from 'firebase';

import './index.css';
import { checkAuthenticationOnLoginPage } from '../../services/authentication';
import { AppConfig } from '../../config';

class AuthorisationPage extends Component {
    state = {
        haveToken: false,
    };

    login = (email, password) => {
        fetch(AppConfig.apiURL + 'user/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        }).then((res) => {
            if (!res.ok) {
                throw res
            }
            return res.json()
        }).then(
            (result) => {
                localStorage.setItem('userObject', JSON.stringify(result.user));
                this.setState({ haveToken: true });
            },
            (err) => err.text().then( errorMessage => {
                alert(JSON.parse(errorMessage).message)
            })
        )
    };

    componentWillMount() {
        const config = AppConfig.firebase;
        firebase.initializeApp(config);
    }

    render() {
        return (
            <div className="wrapper_authorisation_page">
                {checkAuthenticationOnLoginPage()}
                {this.state.haveToken && <Redirect to={'main-page'}/>};
                <i className="page_title"/>
                <div className="authorisation_window">
                    <div className="input_container">
                        <input type="text" ref={input => (this.email = input)} placeholder="Add your login..."/>
                        <div className="input_title">Login</div>
                    </div>
                    <div className="input_container">
                        <input
                            type="password"
                            ref={input => (this.password = input)}
                            placeholder="Add your password..."
                        />
                        <div className="input_title">Password</div>
                    </div>
                    <button
                        className="login_button"
                        onClick={e => {
                            this.login(this.email.value, this.password.value);
                        }}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }
}

export default AuthorisationPage;
