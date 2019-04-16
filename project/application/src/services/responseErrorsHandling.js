function getErrorMessages(error) {
    const clientErrors = error.response.errors || [];
    const clientErrorMessages = [];
    clientErrors.forEach(clientError => {
        clientErrorMessages.push(clientError.message || '');
    });

    return clientErrorMessages;
}

function checkIsDuplicateError(error) {
    return error.indexOf('duplicate key value violates unique constraint') > -1;
}

export const responseErrorsHandling = {
    getErrorMessages,
    checkIsDuplicateError,
};
