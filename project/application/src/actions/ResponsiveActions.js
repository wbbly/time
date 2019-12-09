export const SET_VIEWPORT_SIZE = 'SET_VIEWPORT_SIZE';
export const SWITCH_MENU = 'SWITCH_MENU';
export const SET_IS_MOBILE = 'SET_IS_MOBILE';
export const SET_SWIPED_TASK = 'SET_SWIPED_TASK';
export const SCROLL_TO = 'SCROLL_TO';

export const setViewportSize = payload => ({
    type: SET_VIEWPORT_SIZE,
    payload,
});

export const switchMenu = () => ({
    type: SWITCH_MENU,
});

export const setSwipedTaskAction = payload => ({
    type: SET_SWIPED_TASK,
    payload,
});

export const setIsMobile = payload => ({
    type: SET_IS_MOBILE,
    payload,
});

export const scrollToAction = payload => ({
    type: SCROLL_TO,
    payload,
});
