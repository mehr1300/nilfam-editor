import {translations} from "../../assets/lang/translations.js";

export function t(key, lang) {
    return translations[lang]?.[key] || key;
}
