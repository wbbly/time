import { createInvoice, getInvoices, getInvoiceById } from '../configAPI';

export const GET_INVOICE = 'GET_INVOICE';
export const UPDATE_INVOICE = 'UPDATE_INVOICE';
export const ADD_INVOICE = 'ADD_INVOICE';
export const CREATE_INVOICE_REQUEST = 'CREATE_INVOICE_REQUEST';
export const GET_INVOICE_LIST_REQUEST = 'GET_INVOICE_LIST_REQUEST';
export const GET_INVOICE_LIST_SUCCESS = 'GET_INVOICE_LIST_SUCCESS';
export const GET_INVOICE_BY_ID_REQUEST = 'GET_INVOICE_BY_ID_REQUEST';
export const GET_INVOICE_BY_ID_SUCCESS = 'GET_INVOICE_BY_ID_SUCCESS';

const getInvoiceByIdRequest = () => ({
    type: GET_INVOICE_BY_ID_REQUEST,
});

const getInvoiceByIdSuccess = payload => ({
    type: GET_INVOICE_BY_ID_SUCCESS,
    payload,
});

const createInvoiceRequest = () => ({
    type: CREATE_INVOICE_REQUEST,
});

const getInvoiceListRequest = () => ({
    type: GET_INVOICE_LIST_REQUEST,
});

const getInvoiceListSuccess = payload => ({
    type: GET_INVOICE_LIST_SUCCESS,
    payload,
});

export const addInvoice = payload => async dispatch => {
    dispatch(createInvoiceRequest());
    try {
        const requestBody = {
            vendorId: payload.sender,
            clientId: payload.recipient,
            invoiceDate: payload.dateFrom,
            dueDate: payload.dateDue,
            currency: payload.currency,
            comment: payload.comment,
            invoiceProjects: payload.projects.reduce((acc, project) => {
                acc.push({
                    projectName: project.name,
                    hours: project.amount,
                    rate: project.rate,
                    tax: project.tax,
                });
                return acc;
            }, []),
        };
        const res = await createInvoice(requestBody);
        dispatch(getInvoiceListSuccess(res.data.data.invoices));
    } catch (error) {
        console.log(error);
    }
};

export const getInvoice = invoiceId => async dispatch => {
    dispatch(getInvoiceByIdRequest());
    try {
        const res = await getInvoiceById(invoiceId);
        // console.log(res.data.data.invoice)
        dispatch(getInvoiceByIdSuccess(res.data.data.invoice));
    } catch (error) {
        console.log(error);
    }
};

export const getInvoicesList = () => async dispatch => {
    dispatch(getInvoiceListRequest());
    try {
        const res = await getInvoices();
        dispatch(getInvoiceListSuccess(res.data.data.invoices));
    } catch (error) {
        console.log(error);
    }
};

export const updateInvoice = payload => ({
    type: UPDATE_INVOICE,
    payload,
});
