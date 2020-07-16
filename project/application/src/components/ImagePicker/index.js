import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import classNames from 'classnames';
import defaultAvatarImg from '../../images/icons/Group20.svg';

// Default image-picker
import { MyDropzone } from '../../components/DropZoneComponent/index';

// Actions
import { setUserAvatarAction, deleteUserAvatarAction } from '../../actions/UserActions';
import { showNotificationAction } from '../../actions/NotificationActions';

// Styles
import './style.scss';
import { Loading } from '../Loading';

const SettingsIcon = () => (
    <svg
        className="settings-icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M15.9169 6.61988C15.8611 6.54683 15.7883 6.50338 15.6981 6.48959L13.7918 6.19799C13.6877 5.86462 13.5453 5.52443 13.3648 5.17713C13.4896 5.00353 13.677 4.75878 13.927 4.44271C14.177 4.12671 14.354 3.8959 14.4583 3.74999C14.5138 3.67359 14.5414 3.5938 14.5414 3.51039C14.5414 3.41323 14.5173 3.3369 14.4685 3.28126C14.2187 2.92706 13.6457 2.33683 12.7498 1.5104C12.6668 1.44096 12.5798 1.40627 12.4896 1.40627C12.3854 1.40627 12.3021 1.43746 12.2395 1.49992L10.7604 2.61452C10.4756 2.46862 10.1631 2.34015 9.82302 2.22905L9.53136 0.312499C9.52439 0.222234 9.4844 0.147548 9.4115 0.0885141C9.33849 0.0294074 9.25359 0 9.15621 0H6.84375C6.64235 0 6.51732 0.0971612 6.46875 0.29163C6.37845 0.638717 6.27772 1.28455 6.16665 2.22902C5.84022 2.33336 5.52425 2.4653 5.21872 2.62499L3.78122 1.5104C3.69096 1.44096 3.60069 1.40627 3.51043 1.40627C3.35766 1.40627 3.02958 1.65451 2.52608 2.15105C2.02258 2.64769 1.68075 3.0209 1.50003 3.27079C1.4375 3.36106 1.40634 3.44096 1.40634 3.51039C1.40634 3.5938 1.441 3.67713 1.51043 3.76035C1.97566 4.32296 2.34727 4.80198 2.62507 5.198C2.45143 5.51739 2.31603 5.8369 2.21891 6.15629L0.281341 6.44788C0.204976 6.46182 0.139047 6.50703 0.0834426 6.58343C0.0277291 6.65976 0 6.7397 0 6.82288V9.13545C0 9.22586 0.0277291 9.30726 0.0833331 9.3802C0.138937 9.45309 0.211799 9.49677 0.302101 9.51052L2.20847 9.79183C2.30564 10.1321 2.44797 10.4757 2.6355 10.8228C2.51058 10.9965 2.32308 11.2412 2.07308 11.5572C1.82311 11.8734 1.64587 12.1041 1.54181 12.2499C1.48617 12.3266 1.45844 12.4063 1.45844 12.4896C1.45844 12.5798 1.48274 12.6596 1.5313 12.729C1.80213 13.1042 2.37503 13.6876 3.2501 14.4792C3.32654 14.5556 3.41338 14.5937 3.5105 14.5937C3.61474 14.5937 3.70154 14.5626 3.77093 14.5002L5.23981 13.3854C5.52469 13.5313 5.83711 13.6598 6.17738 13.771L6.46901 15.6876C6.47605 15.7777 6.51597 15.8524 6.58879 15.9116C6.66165 15.9708 6.74681 16 6.84401 16H9.15647C9.35823 16 9.48309 15.9029 9.53179 15.7083C9.62195 15.3612 9.72258 14.7155 9.83368 13.771C10.1601 13.6667 10.4761 13.5347 10.7816 13.375L12.2192 14.5002C12.3164 14.5626 12.4068 14.5937 12.4899 14.5937C12.6427 14.5937 12.969 14.3473 13.469 13.8541C13.9691 13.3612 14.3129 12.9861 14.5002 12.729C14.5626 12.6596 14.5939 12.5798 14.5939 12.4896C14.5939 12.3992 14.5594 12.3123 14.4897 12.2292C13.9899 11.6179 13.6183 11.1389 13.3752 10.7916C13.5141 10.5346 13.6495 10.2187 13.7815 9.84367L15.7086 9.55223C15.7917 9.53825 15.8614 9.49305 15.9168 9.41665C15.9724 9.3401 16 9.26019 16 9.1769V6.86459C16.0001 6.77432 15.9726 6.69285 15.9169 6.61988ZM9.88563 9.88538C9.36495 10.4063 8.73644 10.6668 8.0002 10.6668C7.26403 10.6668 6.6356 10.4063 6.1147 9.88538C5.59397 9.36469 5.3335 8.73615 5.3335 8.00006C5.3335 7.26389 5.59383 6.63546 6.1147 6.11455C6.6356 5.59383 7.26414 5.33336 8.0002 5.33336C8.73644 5.33336 9.36498 5.59383 9.88563 6.11455C10.4064 6.63546 10.6669 7.26389 10.6669 8.00006C10.6669 8.73615 10.4065 9.36473 9.88563 9.88538Z"
            fill="#828282"
        />
    </svg>
);
const ArrowIcon = () => (
    <svg className="arrow-icon" width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5.5 6L10 1" stroke="#828282" />
    </svg>
);

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
        let img = null;
        if (!event[0]) {
            img = event.nativeEvent.target.files[event.nativeEvent.target.files.length - 1];
        } else {
            img = event[0];
        }
        const { onFileLoaded, vocabulary, showNotificationAction } = this.props;
        const { v_a_avatar_upload_error } = vocabulary;

        if (img) {
            if (img.type.split('/')[0] !== 'image' || img.size > 1000000) {
                showNotificationAction({ text: v_a_avatar_upload_error, type: 'error' });
                event.target.value = '';
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
        if (!event[0]) {
            event.target.value = '';
        }
    };

    handleDeleteImage = () => {
        const { onDeleteImage } = this.props;
        onDeleteImage();
        this.setState({ loadedImage: null });
    };

    render() {
        const { vocabulary, imageUrl, placeholder, isViewMode } = this.props;
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
                            backgroundImage: `url("${loadedImage ||
                                imageUrl ||
                                (defaultAvatarImg && !placeholder ? defaultAvatarImg : null)}")`,
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
                            <SettingsIcon />
                            <ArrowIcon />
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
                        <li className="image-picker__settings-menu-item" onClick={this.handleDeleteImage}>
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
