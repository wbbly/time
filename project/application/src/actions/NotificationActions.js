export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

export const showNotificationAction = payload => ({
    type: SHOW_NOTIFICATION,
    payload,
});
export const hideNotificationAction = () => ({
    type: HIDE_NOTIFICATION,
});
