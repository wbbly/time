export function getParametersString(name, params) {
    let pharam = [];
    for (let i = 0; i < params.length; i++) {
        pharam.push(`${name}[]=${params[i]}`);
    }

    return pharam.join('&');
}
