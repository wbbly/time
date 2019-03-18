import React, { Component } from 'react';
import './index.css';
import { Redirect } from 'react-router-dom';
import * as firebase from 'firebase';

class AuthorisationPage extends Component {
    state = {
        haveToken: false,
    };

    login = (email, password) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                localStorage.setItem('active_email', btoa(user.user.email));
                this.setState({ haveToken: true });
            })
            .catch(error => {
                this.email.classList.add('error');
                this.password.classList.add('error');
                setTimeout(() => {
                    this.email.classList.remove('error');
                    this.password.classList.remove('error');
                }, 1000);
            });

        let callback = null;
        let metadataRef = null;
        firebase.auth().onAuthStateChanged(user => {
            if (callback) {
                metadataRef.off('value', callback);
            }
            if (user) {
                metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');
                callback = snapshot => {
                    user.getIdToken(true);
                };
                metadataRef.on('value', callback);
            }
        });
    };

    componentWillMount() {
        let config = {
            apiKey: 'AIzaSyCDnjbXomAp2vCRARCz5Xu-__W8LQRYSUM',
            authDomain: 'lazy-time.firebaseapp.com',
            databaseURL: 'https://lazy-time.firebaseio.com',
            projectId: 'lazy-time',
            storageBucket: 'lazy-time.appspot.com',
            messagingSenderId: '457186337232',
        };
        firebase.initializeApp(config);
    }

    render() {
        return (
            <div className="wrapper_authorisation_page">
                {this.state.haveToken && <Redirect to={'main-page'} />};
                <i className="page_title" />
                <div className="authorisation_window">
                    <div className="input_container">
                        <input type="text" ref={input => (this.email = input)} placeholder="Add your login..." />
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
