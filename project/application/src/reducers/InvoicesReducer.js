import moment from 'moment';
import {
    ADD_INVOICE,
    GET_INVOICE,
    UPDATE_INVOICE,
    CREATE_INVOICE_REQUEST,
    GET_INVOICE_LIST_REQUEST,
    GET_INVOICE_LIST_SUCCESS,
    GET_INVOICE_BY_ID_REQUEST,
    GET_INVOICE_BY_ID_SUCCESS,
    CHANGE_INVOICE_REQUEST,
    DELETE_INVOICE_REQUEST,
} from '../actions/InvoicesActions';

const initialState = {
    invoices: [],
    invoice: null,
    isFetching: false,
};

export default function invoicesReducer(state = initialState, { type, payload }) {
    switch (type) {
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
        case CHANGE_INVOICE_REQUEST:
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
        case GET_INVOICE_LIST_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case GET_INVOICE_LIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                invoices: payload,
            };
        case ADD_INVOICE:
            return {
                ...state,
                invoices: [...state.invoices, payload],
            };
        default:
            return state;
    }
}
