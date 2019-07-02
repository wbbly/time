import translationEN from '../public/locales/en/translation.json';
import translationRU from '../public/locales/ru/translation.json';

export function setLangToStorage(langToSet) {
    localStorage.setItem('lang', langToSet)
}

export function getLangFromStorage() {
    const LANG = localStorage.getItem('lang');

    return LANG ? LANG : 'en'
}