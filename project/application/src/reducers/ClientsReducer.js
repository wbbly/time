import { GET_CLIENTS_REQUEST, GET_CLIENTS_REQUEST_SUCCESS, GET_CLIENTS_REQUEST_ERROR } from '../actions/ClientsActions';

const initialState = {
    clientsList: null,
    isFetching: false,
    isInitialFetching: true,
    error: null,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_CLIENTS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case GET_CLIENTS_REQUEST_SUCCESS:
            return {
                ...state,
                clientsList: payload,
                isFetching: false,
                isInitialFetching: false,
            };
        case GET_CLIENTS_REQUEST_ERROR:
            return {
                ...state,
                error: payload,
                isFetching: false,
                isInitialFetching: false,
            };
        case 'RESET_ALL':
            return {
                initialState,
            };
        default:
            return state;
    }
};
