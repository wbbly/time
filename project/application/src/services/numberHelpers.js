export const numberWithSpaces = number => {
    let parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
};

export const toFixedWithParse = (number, fixedValue) => {
    if (number === undefined) return;
    return parseFloat(number.toFixed(fixedValue));
};

export const spaceAndFixNumber = (number, fixedValue = 2) => {
    if (!isNaN(number)) return number;
    return numberWithSpaces(Math.ceil(toFixedWithParse(number, fixedValue) * 100) / 100);
};
export const numberWithSpacesLimits10 = number => {
    let parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{10})+(?!\d))/g, ' ');
    return parts.join('.');
};
export const numberWithSpacesLimits8 = number => {
    let parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{8})+(?!\d))/g, ' ');
    return parts.join('.');
};
export const fixNumberHundredths = (number, fixedValue = 2) => {
    let result = toFixedWithParse(number, fixedValue);
    if (isNaN(result)) {
        return 0;
    } else {
        return result;
    }
};
export const fixNumberHundredthsLimits10 = (number, fixedValue = 2) => {
    let result = numberWithSpacesLimits10(toFixedWithParse(number, fixedValue));
    if (isNaN(result)) {
        return 0;
    } else {
        return result;
    }
};
export const fixNumberHundredthsLimits8 = (number, fixedValue = 2) => {
    let result = numberWithSpacesLimits8(toFixedWithParse(number, fixedValue));
    if (isNaN(result)) {
        return 0;
    } else {
        return result;
    }
};
