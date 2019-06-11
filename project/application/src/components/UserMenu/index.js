import React, { Component } from 'react';

// Services
import { getLoggedUserName } from '../../services/tokenStorageService';

// Styles
import './index.css';
import { logoutByUnauthorized } from '../../services/authentication';

class UserMenu extends Component {
    render() {
        const username = getLoggedUserName();
        return (
            <div className="wrapper_user_menu">
                <div className="logout_container" onClick={e => this.logout()}>
                    <div className="user_name">{username}</div>
                    {/*<div>*/}
                    {/*<i className="logout" />*/}
                    {/*<span>Log out</span>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }

    logout() {
        return logoutByUnauthorized();
    }
}

export default UserMenu;
