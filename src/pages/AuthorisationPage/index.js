import React from 'react';
import './index.css';

const AuthorisationPage = () => {
    return (

        <div className="wrapper_authorisation_page">
            <i className="page_title"></i>
            <div className="authorisation_window">
                <div className="input_container">
                    <input type="text" placeholder="Add your login..."/>
                    <div className="input_title">
                        Login
                    </div>
                </div>
                <div className="input_container">
                    <input type="text" placeholder="Add your password..."/>
                    <div className="input_title">
                        Password
                    </div>
                </div>
                <button className="login_button">Login</button>
            </div>
        </div>
    );
};
export default AuthorisationPage;
