import React, { Component } from 'react';

// Services
import { getUserNameFromLocalStorage } from '../../services/userStorageService';

// Styles
import './index.css';

class UserMenu extends Component {
    render() {
        const username = getUserNameFromLocalStorage();
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
}

export default UserMenu;
