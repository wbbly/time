import { getLoggedUserName, getLoggedUserEmail, getLoggedUser } from '../services/tokenStorageService';
import * as types from '../actions/UserSettingAction';

const { username: userName, email: userEmail, ...rest } = getLoggedUser();

const initialState = {
    changePasswordModal: false,
    // userName: getLoggedUserName(),
    // userEmail: getLoggedUserEmail(),

    // appVersion: '',
    // exp: null,
    // iat: null,
    // id: '',
    // language: '',
    // timezoneOffset: null,
    userName,
    userEmail,
    ...rest,
};

export function userSettingReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return { ...state, changePasswordModal: action.payload };
        case 'CHANGE_EMAIL':
            return { ...state, userEmail: action.payload };
        case 'CHANGE_NAME':
            return { ...state, userName: action.payload };
        case types.SET_USER_DATA:
            const { username: userName, email: userEmail, ...rest } = action.payload;
            return {
                ...state,
                userName,
                userEmail,
                ...rest,
            };
        default:
            return state;
    }
}
