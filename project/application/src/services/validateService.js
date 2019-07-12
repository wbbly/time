export const authValidation = (name, value) => {
    let error = false;

    if (name === 'email' && !/^[A-Z0-9._%+-]+@[A-Z0-9-]+(\.[A-Z]{2,4})?\.[A-Z]{2,4}$/i.test(value)) {
        error = true;
    }

    return error;
};
