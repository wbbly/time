export function vocabularyInterpolation(str, data) {
    Object.keys(data).forEach(key => {
        const value = data[key];
        str = str.replace(`{{${key}}}`, value);
    });

    return str;
}
