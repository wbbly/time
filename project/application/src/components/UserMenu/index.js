import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppConfig } from '../../config';

// Services

// Styles
import './style.scss';
import { logoutByUnauthorized } from '../../services/authentication';

const UserSettingsIcon = ({ className, onClick }) => (
    <svg
        onClick={onClick}
        className={className}
        width="20"
        height="20"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.55 11.25C14.4502 11.4762 14.4204 11.7271 14.4645 11.9704C14.5086 12.2137 14.6246 12.4382 14.7975 12.615L14.8425 12.66C14.982 12.7993 15.0926 12.9647 15.1681 13.1468C15.2436 13.3289 15.2824 13.5241 15.2824 13.7213C15.2824 13.9184 15.2436 14.1136 15.1681 14.2957C15.0926 14.4778 14.982 14.6432 14.8425 14.7825C14.7032 14.922 14.5378 15.0326 14.3557 15.1081C14.1736 15.1836 13.9784 15.2224 13.7812 15.2224C13.5841 15.2224 13.3889 15.1836 13.2068 15.1081C13.0247 15.0326 12.8593 14.922 12.72 14.7825L12.675 14.7375C12.4982 14.5646 12.2737 14.4486 12.0304 14.4045C11.7871 14.3604 11.5362 14.3902 11.31 14.49C11.0882 14.5851 10.899 14.7429 10.7657 14.9442C10.6325 15.1454 10.561 15.3812 10.56 15.6225V15.75C10.56 16.1478 10.402 16.5294 10.1207 16.8107C9.83936 17.092 9.45782 17.25 9.06 17.25C8.66218 17.25 8.28064 17.092 7.99934 16.8107C7.71804 16.5294 7.56 16.1478 7.56 15.75V15.6825C7.55419 15.4343 7.47384 15.1935 7.32938 14.9915C7.18493 14.7896 6.98305 14.6357 6.75 14.55C6.52379 14.4502 6.27286 14.4204 6.02956 14.4645C5.78626 14.5086 5.56176 14.6246 5.385 14.7975L5.34 14.8425C5.20069 14.982 5.03526 15.0926 4.85316 15.1681C4.67106 15.2436 4.47587 15.2824 4.27875 15.2824C4.08163 15.2824 3.88644 15.2436 3.70434 15.1681C3.52224 15.0926 3.35681 14.982 3.2175 14.8425C3.07804 14.7032 2.9674 14.5378 2.89191 14.3557C2.81642 14.1736 2.77757 13.9784 2.77757 13.7812C2.77757 13.5841 2.81642 13.3889 2.89191 13.2068C2.9674 13.0247 3.07804 12.8593 3.2175 12.72L3.2625 12.675C3.4354 12.4982 3.55139 12.2737 3.5955 12.0304C3.63962 11.7871 3.60984 11.5362 3.51 11.31C3.41493 11.0882 3.25707 10.899 3.05585 10.7657C2.85463 10.6325 2.61884 10.561 2.3775 10.56H2.25C1.85218 10.56 1.47064 10.402 1.18934 10.1207C0.908035 9.83936 0.75 9.45782 0.75 9.06C0.75 8.66218 0.908035 8.28064 1.18934 7.99934C1.47064 7.71804 1.85218 7.56 2.25 7.56H2.3175C2.56575 7.55419 2.8065 7.47384 3.00847 7.32938C3.21045 7.18493 3.36429 6.98305 3.45 6.75C3.54984 6.52379 3.57962 6.27286 3.5355 6.02956C3.49139 5.78626 3.3754 5.56176 3.2025 5.385L3.1575 5.34C3.01804 5.20069 2.9074 5.03526 2.83191 4.85316C2.75642 4.67106 2.71757 4.47587 2.71757 4.27875C2.71757 4.08163 2.75642 3.88644 2.83191 3.70434C2.9074 3.52224 3.01804 3.35681 3.1575 3.2175C3.29681 3.07804 3.46224 2.9674 3.64434 2.89191C3.82644 2.81642 4.02163 2.77757 4.21875 2.77757C4.41587 2.77757 4.61106 2.81642 4.79316 2.89191C4.97526 2.9674 5.14069 3.07804 5.28 3.2175L5.325 3.2625C5.50176 3.4354 5.72626 3.55139 5.96956 3.5955C6.21285 3.63962 6.46379 3.60984 6.69 3.51H6.75C6.97183 3.41493 7.16101 3.25707 7.29427 3.05585C7.42753 2.85463 7.49904 2.61884 7.5 2.3775V2.25C7.5 1.85218 7.65804 1.47064 7.93934 1.18934C8.22064 0.908035 8.60218 0.75 9 0.75C9.39782 0.75 9.77936 0.908035 10.0607 1.18934C10.342 1.47064 10.5 1.85218 10.5 2.25V2.3175C10.501 2.55884 10.5725 2.79463 10.7057 2.99585C10.839 3.19707 11.0282 3.35493 11.25 3.45C11.4762 3.54984 11.7271 3.57962 11.9704 3.5355C12.2137 3.49139 12.4382 3.3754 12.615 3.2025L12.66 3.1575C12.7993 3.01804 12.9647 2.9074 13.1468 2.83191C13.3289 2.75642 13.5241 2.71757 13.7213 2.71757C13.9184 2.71757 14.1136 2.75642 14.2957 2.83191C14.4778 2.9074 14.6432 3.01804 14.7825 3.1575C14.922 3.29681 15.0326 3.46224 15.1081 3.64434C15.1836 3.82644 15.2224 4.02163 15.2224 4.21875C15.2224 4.41587 15.1836 4.61106 15.1081 4.79316C15.0326 4.97526 14.922 5.14069 14.7825 5.28L14.7375 5.325C14.5646 5.50176 14.4486 5.72626 14.4045 5.96956C14.3604 6.21285 14.3902 6.46379 14.49 6.69V6.75C14.5851 6.97183 14.7429 7.16101 14.9442 7.29427C15.1454 7.42753 15.3812 7.49904 15.6225 7.5H15.75C16.1478 7.5 16.5294 7.65804 16.8107 7.93934C17.092 8.22064 17.25 8.60218 17.25 9C17.25 9.39782 17.092 9.77936 16.8107 10.0607C16.5294 10.342 16.1478 10.5 15.75 10.5H15.6825C15.4412 10.501 15.2054 10.5725 15.0042 10.7057C14.8029 10.839 14.6451 11.0282 14.55 11.25V11.25Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const LogoutIcon = ({ className, onClick }) => (
    <svg
        onClick={onClick}
        className={className}
        width="20"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9.46453 12.9849H1.75835V2.01534H9.46484C9.63566 2.01534 9.7743 1.87671 9.7743 1.70588V0.566296C9.7743 0.395474 9.63566 0.256836 9.46484 0.256836H0.30946C0.138638 0.256836 0 0.395474 0 0.566296V14.4337C0 14.6045 0.138638 14.7431 0.30946 14.7431H9.46453C9.63551 14.7431 9.77399 14.6045 9.77399 14.4337V13.2944C9.77399 13.1233 9.63566 12.9849 9.46453 12.9849Z"
            fill="white"
        />
        <path
            d="M14.909 7.28124L10.7433 3.1159C10.6273 2.9997 10.4218 2.99985 10.3057 3.1159L9.31747 4.10432C9.19663 4.22516 9.19663 4.42105 9.31747 4.54189L11.199 6.42372H3.05384C2.88302 6.42372 2.74438 6.56236 2.74438 6.73318V8.26687C2.74438 8.43769 2.88302 8.57633 3.05384 8.57633H11.1995L9.31794 10.4582C9.19709 10.579 9.19709 10.7749 9.31794 10.8957L10.3062 11.8843C10.3642 11.9423 10.4431 11.975 10.525 11.975C10.6072 11.975 10.6858 11.9423 10.7438 11.8843L14.9094 7.71897C14.9674 7.66094 15.0001 7.58203 15.0001 7.50018C14.9999 7.41786 14.967 7.33926 14.909 7.28124Z"
            fill="white"
        />
    </svg>
);

class UserMenu extends Component {
    state = {
        activeUserMenu: false,
    };

    closeDropdown = e => {
        this.setState({ activeUserMenu: false });
        document.removeEventListener('click', this.closeDropdown);
    };

    openDropdown = e => {
        document.addEventListener('click', this.closeDropdown);
        this.setState({ activeUserMenu: true });
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        const { switchMenu, vocabulary, isMobile, user, isShowMenu } = this.props;
        const { v_log_out, v_profile_settings, v_more_option } = vocabulary;

        const { username: userName } = user;
        return (
            <div
                className={classNames('wrapper_user_menu', { 'wrapper_user_menu--mobile': isMobile })}
                onClick={e => {
                    this.openDropdown();
                }}
            >
                <div
                    className={classNames('logout_container', {
                        'logout_container--show_menu': isShowMenu && !isMobile,
                    })}
                >
                    {(!isShowMenu || isMobile) && <div className="user_name">{userName}</div>}
                    {user.avatar ? (
                        <div
                            id="avatar-img-small"
                            style={{
                                backgroundImage: `url("${AppConfig.apiURL}${user.avatar}")`,
                            }}
                            title={v_more_option}
                        />
                    ) : (
                        <i className="default-logo" />
                    )}
                    {this.state.activeUserMenu && (
                        <div
                            className={classNames('user_setting_modal', {
                                'user_setting_modal--show_menu': isShowMenu && !isMobile,
                            })}
                        >
                            <Link
                                onClick={e => {
                                    isMobile && switchMenu();
                                }}
                                to="/user-settings"
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="user_setting_modal_item">
                                    <UserSettingsIcon className="user_settings" />
                                    <span>{v_profile_settings}</span>
                                </div>
                            </Link>
                            <div className="user_setting_modal_item" onClick={e => logoutByUnauthorized()}>
                                <LogoutIcon className="logout" />
                                <span>{v_log_out}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
    user: state.userReducer.user,
});

export default connect(mapStateToProps)(UserMenu);
