export const numberWithSpaces = number => {
    let parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
};

export const toFixedWithParse = (number, fixedValue) => {
    return parseFloat(number.toFixed(fixedValue));
};

export const spaceAndFixNumber = (number, fixedValue = 2) => {
    // if (!isNaN(number)) return number
    return numberWithSpaces(toFixedWithParse(number, fixedValue));
};
