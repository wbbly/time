import { getClientsList, setClient, editClient } from '../configAPI';

export const GET_CLIENTS_REQUEST = 'GET_CLIENTS_REQUEST';
export const GET_CLIENTS_REQUEST_SUCCESS = 'GET_CLIENTS_REQUEST_SUCCESS';
export const GET_CLIENTS_REQUEST_ERROR = 'GET_CLIENTS_REQUEST_ERROR';

const getClientsRequest = () => ({
    type: GET_CLIENTS_REQUEST,
});
const getClientsRequestSuccess = payload => ({
    type: GET_CLIENTS_REQUEST_SUCCESS,
    payload,
});
const getClientsRequestError = payload => ({
    type: GET_CLIENTS_REQUEST_ERROR,
    payload,
});

export const getClientsAction = () => async dispatch => {
    dispatch(getClientsRequest());
    try {
        const { data } = await getClientsList();
        dispatch(getClientsRequestSuccess(data.data.client));
    } catch (error) {
        dispatch(getClientsRequestError(error));
    }
};
export const setClientAction = name => async dispatch => {
    try {
        const { data } = await setClient(name);
        dispatch(getClientsRequestSuccess(data.data.client));
    } catch (error) {
        dispatch(getClientsRequestError(error));
    }
};
export const editClientNameAction = (name, id) => async dispatch => {
    try {
        const { data } = await editClient(name, id);
        dispatch(getClientsRequestSuccess(data.data.client));
    } catch (error) {
        dispatch(getClientsRequestError(error));
    }
};
