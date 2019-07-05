import en_vocabulary from '../locales/en';
import ru_vocabulary from '../locales/ru';

import * as types from '../actions/LanguageActions';

const initialState = {
    vocabulary: ru_vocabulary,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_LANGUAGE: {
            return {
                ...state,
                vocabulary: payload,
            };
        }

        case types.SWITCH_LANGUAGE: {
            return {
                ...state,
                vocabulary: state.vocabulary.lang === 'en' ? ru_vocabulary : en_vocabulary,
            };
        }

        default: {
            return state;
        }
    }
};
