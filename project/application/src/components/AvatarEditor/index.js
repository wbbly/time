import React, { Component } from 'react';
import { connect } from 'react-redux';

// import AvatarEditor from 'react-avatar-editor';
import classNames from 'classnames';
import { AppConfig } from '../../config';

// Default avatar
import dafaultAvatarImg from '../../images/icons/Group20.svg';

// Actions
import { setUserAvatarAction, deleteUserAvatarAction } from '../../actions/UserActions';
import { showNotificationAction } from '../../actions/NotificationActions';

// Styles
import './style.scss';

class Avatar extends Component {
    state = {
        isOpenDropdown: false,
    };

    closeDropdown = event => {
        this.setState({ isOpenDropdown: false });
        document.removeEventListener('click', this.closeDropdown);
    };

    openDropdown = event => {
        document.addEventListener('click', this.closeDropdown);
        this.setState({ isOpenDropdown: true });
    };

    fileHandler = event => {
        const { user, setUserAvatarAction, vocabulary, showNotificationAction } = this.props;
        const { v_a_avatar_upload_error } = vocabulary;
        const img = event.nativeEvent.target.files[0];
        if (img) {
            if (img.type.split('/')[0] !== 'image' || img.size > 1000000) {
                showNotificationAction({ text: v_a_avatar_upload_error, type: 'error' });
                event.target.value = '';
                return;
            }
            const formData = new FormData();
            formData.append('file', img, img.name);

            setUserAvatarAction(user.id, formData);
        }
        event.target.value = '';
    };

    render() {
        const { user, deleteUserAvatarAction, vocabulary } = this.props;
        const { v_upload_image, v_delete_image } = vocabulary;
        const { isOpenDropdown } = this.state;

        return (
            <div className="avatar-wrapper">
                {user.avatar ? (
                    <div
                        className="avatar-img"
                        style={{
                            backgroundImage: `url("${AppConfig.apiURL}${user.avatar}")`,
                        }}
                    />
                ) : (
                    <img src={dafaultAvatarImg} width="150" height="150" alt="avatar" />
                )}

                <div className="avatar-settings" onClick={this.openDropdown}>
                    <i className="settings" />
                    <i className={`arrow_down ${isOpenDropdown ? 'arrow_down_up' : ''}`} />
                </div>
                <ul
                    className={classNames('avatar-settings-menu', {
                        'avatar-settings-menu--hidden': !isOpenDropdown,
                    })}
                >
                    <li className="avatar-settings-menu__item">
                        <label>
                            {v_upload_image}
                            <input
                                type="file"
                                name="avatar"
                                accept="image/png, image/jpeg"
                                style={{ display: 'none' }}
                                onChange={this.fileHandler}
                            />
                        </label>
                    </li>
                    <li className="avatar-settings-menu__item" onClick={event => deleteUserAvatarAction(user.id)}>
                        {v_delete_image}
                    </li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    vocabulary: state.languageReducer.vocabulary,
});

const mapDispatchToProps = {
    setUserAvatarAction,
    deleteUserAvatarAction,
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Avatar);
