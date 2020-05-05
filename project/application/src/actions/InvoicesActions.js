export const GET_INVOICE = 'GET_INVOICE';
export const UPDATE_INVOICE = 'UPDATE_INVOICE';
export const ADD_INVOICE = 'ADD_INVOICE';

export const getInvoice = payload => ({
    type: GET_INVOICE,
    payload,
});

export const addInvoice = payload => ({
    type: ADD_INVOICE,
    payload,
});

export const updateInvoice = payload => ({
    type: UPDATE_INVOICE,
    payload,
});
