import { getLoggedUserName, getLoggedUserEmail } from '../services/tokenStorageService';
import * as types from '../actions/UserSettingAction';

const initialState = {
    changePasswordModal: false,
    userName: getLoggedUserName(),
    userEmail: getLoggedUserEmail(),

    appVersion: '',
    exp: null,
    iat: null,
    id: '',
    language: '',
    timezoneOffset: null,
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
            const { username, email, appVersion, exp, iat, id, language, timezoneOffset } = action.payload;
            return {
                ...state,
                userName: username,
                userEmail: email,
                appVersion,
                exp,
                iat,
                id,
                language,
                timezoneOffset,
            };
        default:
            return state;
    }
}
