import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from '../actions/NotificationActions';
import { RESET_ALL } from '../actions/UserActions';

const { uuid } = require('uuidv4');

const initialState = {
    notificationText: '',
    notificationType: null,
    notificationId: '',
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SHOW_NOTIFICATION:
            return {
                notificationText: payload.text,
                notificationType: payload.type,
                notificationId: uuid(),
            };
        case HIDE_NOTIFICATION:
            return initialState;
        case RESET_ALL:
            return initialState;
        default:
            return state;
    }
};
