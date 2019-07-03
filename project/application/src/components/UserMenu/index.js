import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Services
import { getLoggedUserName } from '../../services/tokenStorageService';

// Styles
import './index.css';
import { logoutByUnauthorized } from '../../services/authentication';

class UserMenu extends Component {
    state = {
        activeUserMenu: false,
    };

    render() {
        const username = getLoggedUserName();
        return (
            <div className="wrapper_user_menu">
                <div className="logout_container">
                    <div className="user_name">
                        {username}
                        <i
                            title="More option"
                            className="profile_user"
                            onClick={e => {
                                this.togglUserMenu();
                            }}
                        />
                    </div>
                    {this.state.activeUserMenu && (
                        <div className="user_setting_modal" ref={div => (this.userSettingthModal = div)}>
                            <Link to="/user-setting" style={{ textDecoration: 'none' }}>
                                <div className="user_setting_modal_item">
                                    <i className="user_settings" />
                                    <span>Profile setting</span>
                                </div>
                            </Link>
                            <div className="user_setting_modal_item" onClick={e => this.logout()}>
                                <i className="logout" />
                                <span>Log out</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    closeDropdown = e => {
        if (e.target.className === 'profile_user') {
            return;
        }
        if (this.userSettingthModal && !this.userSettingthModal.contains(e.target)) {
            this.setState(
                {
                    activeUserMenu: false,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdown);
                }
            );
        }
    };

    togglUserMenu = e => {
        document.addEventListener('click', this.closeDropdown);
        this.setState({ activeUserMenu: !this.state.activeUserMenu });
    };

    logout() {
        return logoutByUnauthorized();
    }
}

export default UserMenu;
