import {
    GET_CLIENTS_REQUEST,
    GET_CLIENTS_REQUEST_SUCCESS,
    GET_CLIENTS_REQUEST_ERROR,
    CHANGE_CLIENTS_REQUEST,
    CHANGE_CLIENTS_SUCCESS,
    CHANGE_CLIENTS_ERROR,
    CHANGE_CLIENTS_SEARCH_VALUE,
    CHANGE_CLIENTS_FILTER_STATUS,
} from '../actions/ClientsActions';

const initialState = {
    clientsList: null,
    isFetching: false,
    searchValue: '',
    filterStatus: 'all',
    isInitialFetching: true,
    error: null,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_CLIENTS_REQUEST:
            return {
                ...state,
                isInitialFetching: false,
            };
        case GET_CLIENTS_REQUEST_SUCCESS:
            return {
                ...state,
                clientsList: payload,
                isInitialFetching: false,
            };
        case GET_CLIENTS_REQUEST_ERROR:
            return {
                ...state,
                error: payload,
                isInitialFetching: false,
            };
        case CHANGE_CLIENTS_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
            };
        case CHANGE_CLIENTS_SUCCESS:
            return {
                ...state,
                clientsList: payload,
                isFetching: false,
            };
        case CHANGE_CLIENTS_ERROR:
            return {
                ...state,
                error: payload,
                isFetching: false,
            };
        case CHANGE_CLIENTS_SEARCH_VALUE:
            return {
                ...state,
                searchValue: payload,
            };
        case CHANGE_CLIENTS_FILTER_STATUS:
            return {
                ...state,
                filterStatus: payload,
            };
        case 'RESET_ALL':
            return {
                initialState,
            };
        default:
            return state;
    }
};
