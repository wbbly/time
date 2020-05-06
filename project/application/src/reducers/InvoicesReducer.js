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
        case UPDATE_INVOICE:
            const findIndex = state.invoices.findIndex(i => i.id === payload.id);
            state.invoices[findIndex] = payload;
            return {
                ...state,
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
