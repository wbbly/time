import { getLoggedUserName, getLoggedUserEmail } from '../services/tokenStorageService';

const initialState = {
    changePasswordModal: false,
    userName: getLoggedUserName(),
    userEmail: getLoggedUserEmail(),
};

export function userSettingReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return { ...state, changePasswordModal: action.payload };
        case 'CHANGE_EMAIL':
            return { ...state, userEmail: action.payload };
        case 'CHANGE_NAME':
            return { ...state, userName: action.payload };
        default:
            return state;
    }
}
