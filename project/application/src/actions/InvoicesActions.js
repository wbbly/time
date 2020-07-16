import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    changeInvoice,
    deleteInvoice,
    changeInvoiceStatus,
} from '../configAPI';

export const CREATE_INVOICE_REQUEST = 'CREATE_INVOICE_REQUEST';
export const CHANGE_INVOICE_REQUEST = 'CHANGE_INVOICE_REQUEST';
export const CHANGE_INVOICE_STATUS_REQUEST = 'CHANGE_INVOICE_STATUS_REQUEST';
export const DELETE_INVOICE_REQUEST = 'DELETE_INVOICE_REQUEST';
export const GET_INVOICE_LIST_REQUEST = 'GET_INVOICE_LIST_REQUEST';
export const GET_INVOICE_LIST_SUCCESS = 'GET_INVOICE_LIST_SUCCESS';
export const GET_INVOICE_BY_ID_REQUEST = 'GET_INVOICE_BY_ID_REQUEST';
export const GET_INVOICE_BY_ID_SUCCESS = 'GET_INVOICE_BY_ID_SUCCESS';
export const SET_SENDER_ID = 'SET-SENDER-ID';

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

const changeInvoiceRequest = () => ({
    type: CREATE_INVOICE_REQUEST,
});

const getInvoiceListRequest = () => ({
    type: GET_INVOICE_LIST_REQUEST,
});

const getInvoiceListSuccess = payload => ({
    type: GET_INVOICE_LIST_SUCCESS,
    payload,
});

const deleteInvoiceRequest = () => ({
    type: DELETE_INVOICE_REQUEST,
});

const changeInvoiceStatusRequest = () => ({
    type: CHANGE_INVOICE_STATUS_REQUEST,
});
export const setSenderIdAC = payload => ({
    type: SET_SENDER_ID,
    payload,
});

const fillFormDataWithObject = (formData, obj) => {
    for (let key in obj) {
        if (Array.isArray(obj[key])) {
            for (let i = 0; i < obj[key].length; i++) {
                for (let arrObjKey in obj[key][i]) {
                    formData.append(`${key}[${i}][${arrObjKey}]`, obj[key][i][arrObjKey]);
                }
            }
        } else {
            formData.append(key, obj[key]);
        }
    }
    return formData;
};

export const addInvoice = (payload, isClone) => async dispatch => {
    dispatch(createInvoiceRequest());
    let formData = payload.image;
    let requestBody = null;
    try {
        if (!isClone) {
            requestBody = {
                vendorId: payload.sender,
                clientId: payload.recipient,
                invoiceDate: payload.dateFrom.toISOString(),
                dueDate: payload.dateDue.toISOString(),
                currency: payload.currency,
                comment: payload.comment,
                invoiceProjects: payload.projects.reduce((acc, project) => {
                    acc.push({
                        projectName: project.project_name,
                        hours: project.hours,
                        rate: project.rate || 0,
                        tax: project.tax || 0,
                    });
                    return acc;
                }, []),
            };
        } else {
            requestBody = {
                vendorId: payload.sender,
                clientId: payload.recipient,
                invoiceDate: payload.dateFrom,
                dueDate: payload.dateDue,
                currency: payload.currency,
                comment: payload.comment,
                originalLogo: payload.image,
                invoiceProjects: payload.projects.reduce((acc, project) => {
                    acc.push({
                        projectName: project.project_name,
                        hours: project.hours,
                        rate: project.rate || 0,
                        tax: project.tax || 0,
                    });
                    return acc;
                }, []),
            };
        }
        if (formData instanceof FormData) {
            requestBody = fillFormDataWithObject(formData, requestBody);
        }
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
        dispatch(getInvoiceByIdSuccess(res.data.data.invoice));
    } catch (error) {
        console.log(error);
    }
};

export const getInvoicesList = () => async dispatch => {
    dispatch(getInvoiceListRequest());
    try {
        const res = await getInvoices();
        if (res.data.data.invoices.length > 0) {
            const senderId = res.data.data.invoices[0].from.id;
            dispatch(setSenderIdAC(senderId));
        }
        dispatch(getInvoiceListSuccess(res.data.data.invoices));
    } catch (error) {
        console.log(error);
    }
};

export const updateInvoice = payload => async dispatch => {
    dispatch(changeInvoiceRequest());
    let formData = payload.image;
    try {
        let requestBody = {
            vendorId: payload.sender,
            clientId: payload.recipient,
            invoiceDate: payload.dateFrom,
            dueDate: payload.dateDue,
            currency: payload.currency,
            comment: payload.comment || '',
            invoiceProjects: payload.projects.reduce((acc, project) => {
                acc.push({
                    projectName: project.project_name || project.name,
                    hours: project.hours || project.amount,
                    rate: project.rate || 0,
                    tax: project.tax || 0,
                });
                return acc;
            }, []),
            removeFile: payload.removeFile,
        };
        if (formData instanceof FormData) {
            requestBody = fillFormDataWithObject(formData, requestBody);
        }
        const res = await changeInvoice({ invoiceId: payload.id, data: requestBody });
        dispatch(getInvoiceListSuccess(res.data.data.invoices));
    } catch (error) {
        console.log(error);
    }
};
export const deleteAvatarThunk = payload => async dispatch => {
    try {
        let requestBody = {
            vendorId: payload.sender,
            clientId: payload.recipient,
            invoiceDate: payload.dateFrom,
            dueDate: payload.dateDue,
            currency: payload.currency,
            comment: payload.comment || '',
            invoiceProjects: payload.projects.reduce((acc, project) => {
                acc.push({
                    projectName: project.project_name || project.name,
                    hours: project.hours || project.amount,
                    rate: project.rate || 0,
                    tax: project.tax || 0,
                });
                return acc;
            }, []),
            removeFile: true,
        };
        const res = await changeInvoice({ invoiceId: payload.id, data: requestBody });
        dispatch(getInvoiceListSuccess(res.data.data.invoices));
    } catch (error) {
        console.log(error);
    }
};
export const deleteInvoiceById = invoiceId => async dispatch => {
    dispatch(deleteInvoiceRequest());
    try {
        const res = await deleteInvoice(invoiceId);
        dispatch(getInvoiceListSuccess(res.data.data.invoices));
    } catch (error) {
        console.log(error);
    }
};

export const editInvoicePaymentStatus = (invoiceId, status) => async dispatch => {
    dispatch(changeInvoiceStatusRequest());
    try {
        const res = await changeInvoiceStatus({ invoiceId, paymentStatus: status });
        dispatch(getInvoiceListSuccess(res.data.data.invoices));
    } catch (error) {
        console.log(error);
    }
};
