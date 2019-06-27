export const SET_VIEWPORT_SIZE = 'SET_VIEWPORT_SIZE';
export const SWITCH_MENU = 'SWITCH_MENU';
export const SET_IS_MOBILE = 'SET_IS_MOBILE';

export const setViewportSize = payload => ({
    type: SET_VIEWPORT_SIZE,
    payload,
});

export const switchMenu = () => ({
    type: SWITCH_MENU,
});

export const setIsMobile = payload => ({
    type: SET_IS_MOBILE,
    payload,
});
