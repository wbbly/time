import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import classNames from 'classnames';

// Default image-picker

// Actions
import { setUserAvatarAction, deleteUserAvatarAction } from '../../actions/UserActions';
import { showNotificationAction } from '../../actions/NotificationActions';
//Component
import { MyDropzone } from '../DropZoneComponent/index';
// Styles
import './style.scss';
import { Loading } from '../Loading';

class ImagePicker extends Component {
    state = {
        isOpenDropdown: false,
        loadedImage: null,
        loadingImage: false,
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
        const { onFileLoaded, vocabulary, showNotificationAction } = this.props;
        const { v_a_avatar_upload_error } = vocabulary;
        let img = null;

        if (!event[0]) {
            img = event.nativeEvent.target.files[event.nativeEvent.target.files.length - 1];
        } else {
            img = event[0];
        }

        if (img) {
            if (img.type.split('/')[0] !== 'image' || img.size > 1000000) {
                showNotificationAction({ text: v_a_avatar_upload_error, type: 'error' });
                return;
            }

            const FR = new FileReader();

            FR.onloadstart = () => this.setState({ loadingImage: true });
            FR.onloadend = () => this.setState({ loadingImage: false });

            FR.addEventListener('load', e => {
                this.setState({ loadedImage: e.target.result });
            });

            FR.readAsDataURL(img);

            const formData = new FormData();
            formData.append('file', img, img.name);

            onFileLoaded(formData);
        }
    };

    deleteHandler = event => {
        const { onDeleteImage } = this.props;
        this.setState({ loadedImage: null }, () => onDeleteImage(event));
    };

    render() {
        const { vocabulary, placeholder, isViewMode, imageUrl } = this.props;
        const { v_upload_image, v_delete_image } = vocabulary;
        const { isOpenDropdown, loadedImage, loadingImage } = this.state;
        return (
            <div
                className={classNames('image-picker', {
                    'image-picker--view-mode': isViewMode,
                })}
            >
                <Loading flag={loadingImage} mode="overlay" withLogo={false}>
                    <div
                        className="image-picker__img"
                        style={{
                            backgroundImage: `url("${loadedImage || imageUrl}")`,
                        }}
                    >
                        {!isViewMode && (
                            <MyDropzone
                                fileHandler={this.fileHandler}
                                loadedImage={loadedImage}
                                imageUrl={imageUrl}
                                placeholder={placeholder}
                            />
                        )}
                    </div>
                    {!isViewMode && (
                        <div className="image-picker__settings" onClick={this.openDropdown}>
                            <i className="settings" />
                            <i className={`arrow_down ${isOpenDropdown ? 'arrow_down_up' : ''}`} />
                        </div>
                    )}
                    <ul
                        className={classNames('image-picker__settings-menu', {
                            'image-picker__settings-menu--hidden': !isOpenDropdown,
                        })}
                    >
                        <li className="image-picker__settings-menu-item">
                            <label>
                                {v_upload_image}
                                <input
                                    type="file"
                                    name="image-picker"
                                    accept="image/png, image/jpeg"
                                    style={{ display: 'none' }}
                                    onChange={this.fileHandler}
                                />
                            </label>
                        </li>
                        <li className="image-picker__settings-menu-item" onClick={this.deleteHandler}>
                            {v_delete_image}
                        </li>
                    </ul>
                </Loading>
            </div>
        );
    }
}

ImagePicker.propTypes = {
    onFileLoaded: PropTypes.func.isRequired,
    onDeleteImage: PropTypes.func.isRequired,
    imageUrl: PropTypes.string,
    placeholder: PropTypes.string,
};

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
)(ImagePicker);
