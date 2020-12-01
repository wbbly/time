import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    changeInvoice,
    deleteInvoice,
    changeInvoiceStatus,
    getInvoiceViewData,
    sendInvoiceLetter,
} from '../configAPI';

export const CREATE_INVOICE_REQUEST = 'CREATE_INVOICE_REQUEST';
export const CHANGE_INVOICE_REQUEST = 'CHANGE_INVOICE_REQUEST';
export const CHANGE_INVOICE_SUCCESS = 'CHANGE_INVOICE_SUCCESS';
export const CHANGE_INVOICE_STATUS_REQUEST = 'CHANGE_INVOICE_STATUS_REQUEST';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const DELETE_INVOICE_REQUEST = 'DELETE_INVOICE_REQUEST';
export const GET_INVOICE_LIST_REQUEST = 'GET_INVOICE_LIST_REQUEST';
export const GET_INVOICE_LIST_SUCCESS = 'GET_INVOICE_LIST_SUCCESS';
export const GET_INVOICE_BY_ID_REQUEST = 'GET_INVOICE_BY_ID_REQUEST';
export const GET_INVOICE_BY_ID_SUCCESS = 'GET_INVOICE_BY_ID_SUCCESS';
export const SET_SENDER_ID = 'SET-SENDER-ID';
export const ADD_INVOICE_ERROR = 'ADD_INVOICE_ERROR';

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
    type: CHANGE_INVOICE_REQUEST,
});

const changeInvoiceSuccess = () => ({
    type: CHANGE_INVOICE_SUCCESS,
});

const getInvoiceListRequest = () => ({
    type: GET_INVOICE_LIST_REQUEST,
});

const getInvoiceListSuccess = payload => ({
    type: GET_INVOICE_LIST_SUCCESS,
    payload,
});

export const changePage = payload => ({
    type: CHANGE_PAGE,
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

const addInvoiceError = payload => ({
    type: ADD_INVOICE_ERROR,
    payload,
});

const fillFormDataWithObject = (formData, obj) => {
    for (let key in obj) {
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
            for (let ObjKey in obj[key]) {
                formData.append(`${key}[${ObjKey}]`, obj[key][ObjKey]);
            }
        }

        if (Array.isArray(obj[key])) {
            for (let i = 0; i < obj[key].length; i++) {
                for (let arrObjKey in obj[key][i]) {
                    formData.append(`${key}[${i}][${arrObjKey}]`, obj[key][i][arrObjKey]);
                }
            }
        } else {
            if (Object.prototype.toString.call(obj[key]) !== '[object Object]') formData.append(key, obj[key]);
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
                invoiceNumber: payload.invoiceNumber,
                vendorId: payload.vendorId,
                clientId: payload.recipient.id,
                invoiceDate: payload.dateFrom.toISOString(),
                dueDate: payload.dateDue.toISOString(),
                timezoneOffset: payload.timezoneOffset,
                currency: payload.currency,
                comment: payload.comment,
                invoiceVendor: payload.sender,
                invoiceProjects: payload.projects.reduce((acc, project) => {
                    acc.push({
                        projectName: project.project_name,
                        hours: project.hours,
                        rate: project.rate || 0,
                        tax: project.tax || 0,
                    });
                    return acc;
                }, []),
                discount: payload.discount,
            };
        } else {
            requestBody = {
                invoiceNumber: '',
                vendorId: payload.vendorId,
                clientId: payload.recipient.id,
                invoiceDate: payload.dateFrom,
                dueDate: payload.dateDue,
                timezoneOffset: payload.timezoneOffset,
                currency: payload.currency,
                comment: payload.comment,
                invoiceVendor: payload.sender,
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
                discount: payload.discount,
            };
        }
        if (formData instanceof FormData) {
            requestBody = fillFormDataWithObject(formData, requestBody);
        }
        const res = await createInvoice(requestBody);
        dispatch(changeInvoiceSuccess());
    } catch (error) {
        console.log(error);
        if (error.response) {
            dispatch(addInvoiceError(error.response.data.message));
        }
    }
};

export const getInvoice = invoiceId => async dispatch => {
    dispatch(getInvoiceByIdRequest());
    try {
        const res = await getInvoiceById(invoiceId);
        dispatch(getInvoiceByIdSuccess(res.data));
    } catch (error) {
        console.log(error);
    }
};

export const sendInvoiceLetterThunk = (invoiceId, data, isInvoicePageDetailed) => async dispatch => {
    if (!isInvoicePageDetailed) {
        dispatch(changeInvoiceStatusRequest());
    }
    try {
        const res = await sendInvoiceLetter(invoiceId, data);
        if (!isInvoicePageDetailed) {
            dispatch(changeInvoiceSuccess());
        }
    } catch (error) {
        console.log(error);
    }
};

export const getInvoicesList = (page, limit) => async dispatch => {
    dispatch(getInvoiceListRequest());
    try {
        const res = await getInvoices(page + 1, limit);
        if (res.data.data.invoices.length > 0) {
            const senderId = res.data.data.invoices[0].from.id;
            dispatch(setSenderIdAC(senderId));
        }
        const newPage =
            +res.data.data.pagination.page > +res.data.data.pagination.pagesAmount
                ? +res.data.data.pagination.pagesAmount || 1
                : +res.data.data.pagination.page;
        dispatch(
            getInvoiceListSuccess({
                invoices: res.data.data.invoices,
                page: newPage - 1,
                pageCount: +res.data.data.pagination.pagesAmount,
            })
        );
    } catch (error) {
        console.log(error);
    }
};

export const getInvoiceViewDataThunk = id => async dispatch => {
    dispatch(getInvoiceByIdRequest());
    try {
        const res = await getInvoiceViewData(id);
        dispatch(getInvoiceByIdSuccess(res.data));
    } catch (error) {
        console.log(error);
    }
};

export const updateInvoice = payload => async dispatch => {
    dispatch(changeInvoiceRequest());
    let formData = payload.image;
    try {
        let requestBody = {
            invoiceNumber: payload.invoiceNumber,
            vendorId: payload.vendorId,
            clientId: payload.recipient.id,
            invoiceDate: payload.dateFrom,
            dueDate: payload.dateDue,
            timezoneOffset: payload.timezoneOffset,
            currency: payload.currency,
            comment: payload.comment || '',
            invoiceVendor: payload.sender,
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
            discount: payload.discount,
        };
        if (formData instanceof FormData) {
            requestBody = fillFormDataWithObject(formData, requestBody);
        }
        const res = await changeInvoice({ invoiceId: payload.id, data: requestBody });
        dispatch(changeInvoiceSuccess());
    } catch (error) {
        console.log(error);
        if (error.response) {
            dispatch(addInvoiceError(error.response.data.message));
        }
    }
};

export const deleteAvatarThunk = payload => async dispatch => {
    dispatch(changeInvoiceRequest());
    try {
        let requestBody = {
            invoiceNumber: payload.invoiceNumber,
            vendorId: payload.vendorId,
            clientId: payload.recipient.id,
            invoiceDate: payload.dateFrom,
            dueDate: payload.dateDue,
            timezoneOffset: payload.timezoneOffset,
            currency: payload.currency,
            comment: payload.comment || '',
            invoiceVendor: payload.sender,
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
        dispatch(changeInvoiceSuccess());
    } catch (error) {
        console.log(error);
    }
};

export const deleteInvoiceById = invoiceId => async dispatch => {
    dispatch(deleteInvoiceRequest());
    try {
        const res = await deleteInvoice(invoiceId);
        dispatch(changeInvoiceSuccess());
    } catch (error) {
        console.log(error);
    }
};

export const editInvoicePaymentStatus = (invoiceId, status) => async dispatch => {
    dispatch(changeInvoiceStatusRequest());
    try {
        const res = await changeInvoiceStatus({ invoiceId, paymentStatus: status });
        dispatch(changeInvoiceSuccess());
    } catch (error) {
        console.log(error);
    }
};
