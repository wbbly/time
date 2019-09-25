import en_vocabulary from '../locales/en';
import ru_vocabulary from '../locales/ru';
import de_vocabulary from '../locales/de';

import * as types from '../actions/LanguageActions';

const initialState = {
    languages: [
        {
            short: 'ru',
            long: 'Russian',
        },
        {
            short: 'en',
            long: 'English',
        },
        {
            short: 'de',
            long: 'Deutsch',
        },
    ],
    vocabulary: en_vocabulary,
};

const setVocabulary = lang => {
    if (lang === 'en') return en_vocabulary;
    if (lang === 'ru') return ru_vocabulary;
    if (lang === 'de') return de_vocabulary;
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
            state.languages.sort((a, b) => {
                if(a.long < b.long) { return -1; }
                if(a.long > b.long) { return 1; }
                return 0;
            });
            return state;
        }
    }
};
