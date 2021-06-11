import {
    createInvoice,
    getInvoices,
    getInvoicesTotal,
    getInvoiceById,
    changeInvoice,
    deleteInvoice,
    changeInvoiceStatus,
    getInvoiceViewData,
    sendInvoiceLetter,
    getInvoicesCountsByStatus,
    getPartialPayments,
    postPartialPayments,
} from '../configAPI';

export const CREATE_INVOICE_REQUEST = 'CREATE_INVOICE_REQUEST';
export const CHANGE_INVOICE_REQUEST = 'CHANGE_INVOICE_REQUEST';
export const CHANGE_INVOICE_SUCCESS = 'CHANGE_INVOICE_SUCCESS';
export const CHANGE_INVOICE_STATUS_REQUEST = 'CHANGE_INVOICE_STATUS_REQUEST';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const DELETE_INVOICE_REQUEST = 'DELETE_INVOICE_REQUEST';
export const GET_INVOICE_LIST_INITIAL_REQUEST = 'GET_INVOICE_LIST_INITIAL_REQUEST';
export const GET_INVOICE_LIST_REQUEST = 'GET_INVOICE_LIST_REQUEST';
export const GET_INVOICE_LIST_SUCCESS = 'GET_INVOICE_LIST_SUCCESS';
export const GET_INVOICE_COUNTS_BY_STATUS = 'GET_INVOICE_COUNTS_BY_STATUS';
export const GET_GRAND_TOTAL = 'GET_GRAND_TOTAL';
export const GET_INVOICE_BY_ID_REQUEST = 'GET_INVOICE_BY_ID_REQUEST';
export const GET_INVOICE_BY_ID_SUCCESS = 'GET_INVOICE_BY_ID_SUCCESS';
export const GET_INVOICE_BY_ID_ERROR = 'GET_INVOICE_BY_ID_ERROR';
export const SET_SENDER_ID = 'SET-SENDER-ID';
export const SET_COPIED_INVOICE_ID = 'SET_COPIED_INVOICE_ID';
export const ADD_INVOICE_ERROR = 'ADD_INVOICE_ERROR';
export const GET_PARTIAL_PAYMENTS = 'GET_PARTIAL_PAYMENTS';
export const GET_PARTIAL_PAYMENTS_SUCCESS = 'GET_PARTIAL_PAYMENTS_SUCCESS';
export const GET_PARTIAL_PAYMENTS_FAIL = 'GET_PARTIAL_PAYMENTS_FAIL';
export const CLEAR_PARTIAL_PAYMENT = 'CLEAR_PARTIAL_PAYMENT';
export const ADD_PARTIAL_PAYMENT = 'ADD_PARTIAL_PAYMENT';
export const ADD_PARTIAL_PAYMENT_SUCCESS = 'ADD_PARTIAL_PAYMENT_SUCCESS';
export const ADD_PARTIAL_PAYMENT_FAIL = 'ADD_PARTIAL_PAYMENT_FAIL';
export const CHANGE_INITIAL_LOADER = 'CHANGE_INITIAL_LOADER';

const addPartialPaymentsRequest = payload => ({
    type: ADD_PARTIAL_PAYMENT,
    payload,
});
const addPartialPaymentsRequestSuccess = () => ({
    type: ADD_PARTIAL_PAYMENT_SUCCESS,
});
const addPpartialPaymentsRequestFail = payload => ({
    type: ADD_PARTIAL_PAYMENT_FAIL,
    payload,
});

const partialPaymentsRequest = payload => ({
    type: GET_PARTIAL_PAYMENTS,
    payload,
});
const partialPaymentsRequestSuccess = payload => ({
    type: GET_PARTIAL_PAYMENTS_SUCCESS,
    payload,
});
const partialPaymentsRequestFail = payload => ({
    type: GET_PARTIAL_PAYMENTS_FAIL,
    payload,
});

export const clearPartialPaymentInfo = () => ({
    type: CLEAR_PARTIAL_PAYMENT,
});

const getInvoiceByIdRequest = () => ({
    type: GET_INVOICE_BY_ID_REQUEST,
});

const getInvoiceByIdSuccess = payload => ({
    type: GET_INVOICE_BY_ID_SUCCESS,
    payload,
});

const getInvoiceByIdError = () => ({
    type: GET_INVOICE_BY_ID_ERROR,
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

const getInvoiceListInitialRequest = () => ({
    type: GET_INVOICE_LIST_INITIAL_REQUEST,
});

const getInvoiceCountsByStatus = payload => ({
    type: GET_INVOICE_COUNTS_BY_STATUS,
    payload,
});

const getInvoiceListSuccess = payload => ({
    type: GET_INVOICE_LIST_SUCCESS,
    payload,
});

const getGrandTotal = payload => ({
    type: GET_GRAND_TOTAL,
    payload,
});

export const changePage = payload => ({
    type: CHANGE_PAGE,
    payload,
});

export const setCopiedInvoiceId = payload => ({
    type: SET_COPIED_INVOICE_ID,
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

const changeInitialLoader = payload => ({
    type: CHANGE_INITIAL_LOADER,
    payload,
});

const fillFormDataWithObject = (formData, obj) => {
    for (let key in obj) {
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
            for (let ObjKey in obj[key]) {
                formData.append(`${key}[${ObjKey}]`, obj[key][ObjKey] || '');
            }
        }

        if (Array.isArray(obj[key])) {
            for (let i = 0; i < obj[key].length; i++) {
                for (let arrObjKey in obj[key][i]) {
                    formData.append(`${key}[${i}][${arrObjKey}]`, obj[key][i][arrObjKey] || '');
                }
            }
        } else {
            if (Object.prototype.toString.call(obj[key]) !== '[object Object]') formData.append(key, obj[key]);
        }
    }
    return formData;
};

export const getPartialPaymentsRequest = invoiceId => {
    return async dispatch => {
        dispatch(partialPaymentsRequest());
        try {
            const { data } = await getPartialPayments(invoiceId);
            dispatch(partialPaymentsRequestSuccess(data));
        } catch (error) {
            dispatch(partialPaymentsRequestFail(error));
        }
    };
};

export const addPartialPayments = payload => {
    return async dispatch => {
        dispatch(addPartialPaymentsRequest());
        try {
            await postPartialPayments(payload);
            dispatch(addPartialPaymentsRequestSuccess());
            dispatch(getPartialPaymentsRequest(payload.invoiceId));
        } catch (error) {
            dispatch(addPpartialPaymentsRequestFail(error));
        }
    };
};

export const resetInvoicesParams = () => dispatch => {
    dispatch(changePage(0));
};

export const addInvoice = (payload, isClone) => async dispatch => {
    dispatch(createInvoiceRequest());
    let formData = payload.image;
    let requestBody = null;
    let d = payload.dateDue;
    d.setHours(23, 59, 59, 0);
    const dateDue = d.toISOString();
    try {
        if (!isClone) {
            requestBody = {
                invoiceNumber: payload.invoiceNumber,
                reference: payload.reference,
                vendorId: payload.vendorId,
                clientId: payload.recipient.id,
                invoiceDate: payload.dateFrom.toISOString(),
                dueDate: dateDue,
                timezoneOffset: payload.timezoneOffset,
                currency: payload.currency,
                comment: payload.comment,
                invoiceVendor: payload.sender,
                invoiceProjects: payload.projects.reduce((acc, project) => {
                    acc.push({
                        projectName: project.project_name,
                        hours: project.hours,
                        rate: project.rate || '0',
                        tax: project.tax || '0',
                    });
                    return acc;
                }, []),
                discount: payload.discount,
            };
        } else {
            requestBody = {
                invoiceNumber: '',
                reference: payload.reference,
                vendorId: payload.vendorId,
                clientId: payload.recipient.id,
                invoiceDate: payload.dateFrom,
                dueDate: dateDue,
                timezoneOffset: payload.timezoneOffset,
                currency: payload.currency,
                comment: payload.comment,
                invoiceVendor: payload.sender,
                originalLogo: payload.image,
                invoiceProjects: payload.projects.reduce((acc, project) => {
                    acc.push({
                        projectName: project.project_name,
                        hours: project.hours,
                        rate: project.rate || '0',
                        tax: project.tax || '0',
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
        if (isClone) dispatch(setCopiedInvoiceId(res.data.id));
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
        await sendInvoiceLetter(invoiceId, data);
        if (!isInvoicePageDetailed) {
            dispatch(changeInvoiceSuccess());
        }
    } catch (error) {
        console.log(error);
    }
};

export const getInvoicesList = ({
    page,
    limit,
    searchValue = null,
    status = null,
    isInitialFetching = false,
}) => async dispatch => {
    if (isInitialFetching) {
        dispatch(getInvoiceListInitialRequest());
    } else {
        dispatch(getInvoiceListRequest());
    }
    const params = {
        search: searchValue,
        page: page + 1,
        limit,
        status: status === 'all' ? null : status,
    };
    try {
        const res = await getInvoices(params);
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

        if (+res.data.data.pagination.pagesAmount > 0) {
            dispatch(
                getInvoiceTotal({
                    searchValue: params.search,
                    status: params.status,
                })
            );
        } else {
            dispatch(getGrandTotal({}));
        }
    } catch (error) {
        console.log(error);
    }
};

export const getInvoiceTotal = ({ searchValue = null, status = null }) => async dispatch => {
    const params = {
        search: searchValue,
        status,
    };
    try {
        const res = await getInvoicesTotal(params);
        dispatch(getGrandTotal(res.data));
    } catch (error) {
        console.log(error);
    }
};

export const getInvoicesCountsByStatusAction = () => async dispatch => {
    try {
        const res = await getInvoicesCountsByStatus();
        dispatch(getInvoiceCountsByStatus(res.data));
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
        dispatch(getInvoiceByIdError());
        console.log(error);
    }
};

export const updateInvoice = (payload, withLoader) => async dispatch => {
    if (withLoader) {
        dispatch(changeInvoiceRequest());
    }
    let formData = payload.image;
    try {
        let requestBody = {
            invoiceNumber: payload.invoiceNumber,
            reference: payload.reference,
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
                    rate: project.rate || '0',
                    tax: project.tax || '0',
                });
                return acc;
            }, []),
            removeFile: payload.removeFile,
            discount: payload.discount,
        };
        if (formData instanceof FormData) {
            requestBody = fillFormDataWithObject(formData, requestBody);
        }
        await changeInvoice({ invoiceId: payload.id, data: requestBody });
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
                    rate: project.rate || '0',
                    tax: project.tax || '0',
                });
                return acc;
            }, []),
            removeFile: true,
        };
        await changeInvoice({ invoiceId: payload.id, data: requestBody });
        dispatch(changeInvoiceSuccess());
    } catch (error) {
        console.log(error);
    }
};

export const deleteInvoiceById = invoiceId => async dispatch => {
    dispatch(deleteInvoiceRequest());
    try {
        await deleteInvoice(invoiceId);
        dispatch(changeInvoiceSuccess());
    } catch (error) {
        console.log(error);
    }
};

export const editInvoicePaymentStatus = (invoiceId, status) => async dispatch => {
    dispatch(changeInvoiceStatusRequest());
    try {
        await changeInvoiceStatus({ invoiceId, paymentStatus: status });
        dispatch(changeInvoiceSuccess());
    } catch (error) {
        console.log(error);
    }
};

export const changeInitialLoaderAction = value => dispatch => {
    dispatch(changeInitialLoader(value));
};
