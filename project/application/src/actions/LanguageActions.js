export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SWITCH_LANGUAGE = 'SWITCH_LANGUAGE';

export const setLanguage = payload => ({
    type: SET_LANGUAGE,
    payload,
});

export const switchLanguage = () => ({
    type: SWITCH_LANGUAGE,
});
