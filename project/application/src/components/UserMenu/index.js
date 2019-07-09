import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Services
import { getLoggedUserName } from '../../services/tokenStorageService';

// Styles
import './style.scss';
import { logoutByUnauthorized } from '../../services/authentication';

class UserMenu extends Component {
    state = {
        activeUserMenu: false,
    };

    render() {
        const { switchMenu, vocabulary, isMobile } = this.props;
        const { v_log_out, v_profile_settings } = vocabulary;
        const username = getLoggedUserName();
        return (
            <div className={classNames('wrapper_user_menu', { 'wrapper_user_menu--mobile': isMobile })}>
                <div className="logout_container">
                    <div className="user_name">{username}</div>
                    <i
                        title="More option"
                        className="profile_user"
                        onClick={e => {
                            this.togglUserMenu();
                        }}
                    />
                    {this.state.activeUserMenu && (
                        <div className="user_setting_modal" ref={div => (this.userSettingthModal = div)}>
                            <Link
                                onClick={e => {
                                    this.togglUserMenu();
                                    switchMenu();
                                }}
                                to="/user-settings"
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="user_setting_modal_item">
                                    <i className="user_settings" />
                                    <span>{v_profile_settings}</span>
                                </div>
                            </Link>
                            <div
                                className="user_setting_modal_item"
                                onClick={e => {
                                    this.togglUserMenu();
                                    this.logout();
                                }}
                            >
                                <i className="logout" />
                                <span>{v_log_out}</span>
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

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
});

export default connect(mapStateToProps)(UserMenu);
