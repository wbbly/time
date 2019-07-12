import en_vocabulary from '../locales/en';
import ru_vocabulary from '../locales/ru';

import * as types from '../actions/LanguageActions';

const initialState = {
    vocabulary: en_vocabulary,
};

const setVocabulary = lang => {
    if (lang === 'en') return en_vocabulary;
    if (lang === 'ru') return ru_vocabulary;
    return en_vocabulary;
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_LANGUAGE: {
            return {
                ...state,
                vocabulary: setVocabulary(payload),
            };
        }

        default: {
            return state;
        }
    }
};
