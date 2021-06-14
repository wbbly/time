import {
    CREATE_INVOICE_REQUEST,
    GET_INVOICE_LIST_REQUEST,
    GET_INVOICE_LIST_INITIAL_REQUEST,
    GET_INVOICE_LIST_SUCCESS,
    GET_GRAND_TOTAL,
    GET_INVOICE_BY_ID_REQUEST,
    GET_INVOICE_BY_ID_SUCCESS,
    GET_INVOICE_BY_ID_ERROR,
    GET_INVOICE_COUNTS_BY_STATUS,
    CHANGE_INVOICE_REQUEST,
    CHANGE_INVOICE_SUCCESS,
    DELETE_INVOICE_REQUEST,
    CHANGE_INVOICE_STATUS_REQUEST,
    SET_SENDER_ID,
    CHANGE_PAGE,
    SET_COPIED_INVOICE_ID,
    ADD_INVOICE_ERROR,
    GET_PARTIAL_PAYMENTS,
    GET_PARTIAL_PAYMENTS_SUCCESS,
    GET_PARTIAL_PAYMENTS_FAIL,
    CLEAR_PARTIAL_PAYMENT,
    ADD_PARTIAL_PAYMENT,
    ADD_PARTIAL_PAYMENT_SUCCESS,
    ADD_PARTIAL_PAYMENT_FAIL,
    CHANGE_INITIAL_LOADER,
} from '../actions/InvoicesActions';

const initialState = {
    invoices: [],
    page: 0,
    limit: 10,
    pageCount: 1,
    totalSumm: null,
    grandTotal: {},
    invoice: null,
    invoiceError: false,
    isFetching: false,
    isInitialFetching: true,
    senderId: '',
    copiedInvoiceId: '',
    error: null,
    partialPayments: { data: [], isFetching: false, error: null },
};

export default function invoicesReducer(state = initialState, { type, payload }) {
    switch (type) {
        case ADD_PARTIAL_PAYMENT:
            return {
                ...state,
                partialPayments: { ...state.partialPayments, isFetching: true },
            };
        case ADD_PARTIAL_PAYMENT_SUCCESS:
            return {
                ...state,
                partialPayments: { ...state.partialPayments, isFetching: false },
            };
        case ADD_PARTIAL_PAYMENT_FAIL:
            return {
                ...state,
                partialPayments: { ...state.partialPayments, isFetching: false, error: payload },
            };
        case GET_PARTIAL_PAYMENTS:
            return {
                ...state,
                partialPayments: { ...state.partialPayments, isFetching: true },
            };
        case GET_PARTIAL_PAYMENTS_SUCCESS:
            return {
                ...state,
                partialPayments: {
                    ...state.partialPayments,
                    isFetching: false,
                    data: payload.data.invoice_payment.sort((a, b) => new Date(a.date) - new Date(b.date)),
                },
            };
        case GET_PARTIAL_PAYMENTS_FAIL:
            return {
                ...state,
                partialPayments: { ...state.partialPayments, isFetching: false, error: payload },
            };
        case CLEAR_PARTIAL_PAYMENT:
            return {
                ...state,
                partialPayments: { data: [], isFetching: false, error: null },
            };

        case GET_INVOICE_BY_ID_REQUEST:
            return {
                ...state,
                isFetching: true,
                invoice: null,
            };
        case GET_INVOICE_BY_ID_SUCCESS:
            return {
                ...state,
                isFetching: false,
                invoice: payload,
            };
        case GET_INVOICE_BY_ID_ERROR:
            return {
                ...state,
                isFetching: false,
                invoiceError: true,
            };
        case CHANGE_INVOICE_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case CHANGE_INVOICE_SUCCESS:
            return {
                ...state,
                isFetching: false,
            };
        case CHANGE_INVOICE_STATUS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case DELETE_INVOICE_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case CREATE_INVOICE_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case GET_INVOICE_LIST_INITIAL_REQUEST:
            return {
                ...state,
                isInitialFetching: true,
            };
        case GET_INVOICE_COUNTS_BY_STATUS:
            return {
                ...state,
                totalSumm: payload,
            };
        case GET_INVOICE_LIST_REQUEST:
            return {
                ...state,
            };
        case GET_INVOICE_LIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isInitialFetching: false,
                invoices: payload.invoices,
                page: payload.page,
                pageCount: payload.pageCount,
            };
        case GET_GRAND_TOTAL:
            return {
                ...state,
                grandTotal: payload,
            };
        case SET_SENDER_ID:
            return {
                ...state,
                senderId: payload,
            };
        case CHANGE_PAGE:
            return {
                ...state,
                page: payload,
            };
        case SET_COPIED_INVOICE_ID:
            return {
                ...state,
                copiedInvoiceId: payload,
            };
        case ADD_INVOICE_ERROR:
            return {
                ...state,
                isFetching: false,
                isInitialFetching: false,
                error: payload,
            };
        case CHANGE_INITIAL_LOADER:
            return {
                ...state,
                isInitialFetching: payload,
            };
        default:
            return state;
    }
}
