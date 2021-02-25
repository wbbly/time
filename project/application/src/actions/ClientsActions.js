import { getClientsList, setClient, editClient, deleteClient } from '../configAPI';

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

export const getClientsAction = (params = {}) => async dispatch => {
    dispatch(getClientsRequest());
    try {
        const { data } = await getClientsList(params);
        dispatch(getClientsRequestSuccess(data.data.client));
    } catch (error) {
        dispatch(getClientsRequestError(error));
    }
};
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
export const setClientAction = (client, logoFile) => async dispatch => {
    let formData = logoFile;
    try {
        let requestBody = {
            name: client.name,
            language: client.language,
            country: client.country,
            city: client.city,
            state: client.state,
            phone: client.phone,
            email: client.email,
            zip: client.zip,
            companyName: client.company_name,
        };
        if (formData instanceof FormData) {
            requestBody = fillFormDataWithObject(formData, requestBody);
        }
        const { data } = await setClient(requestBody);
        dispatch(getClientsRequestSuccess(data.data.client));
        return data;
    } catch (error) {
        dispatch(getClientsRequestError(error));
    }
};
export const editClientThunk = (client, id, logoFile) => async dispatch => {
    let formData = logoFile;
    try {
        let requestBody = {
            name: client.name,
            language: client.language,
            country: client.country,
            city: client.city,
            state: client.state,
            phone: client.phone,
            email: client.email,
            zip: client.zip,
            project: 'new project',
            companyName: client.company_name,
        };
        if (formData instanceof FormData) {
            requestBody = fillFormDataWithObject(formData, requestBody);
        }

        const { data } = await editClient(requestBody, id);

        dispatch(getClientsRequestSuccess(data.data.client));
    } catch (error) {
        dispatch(getClientsRequestError(error));
    }
};
export const deleteClientThunk = id => async dispatch => {
    try {
        const data = await deleteClient(id);
        dispatch(getClientsRequestSuccess(data.data.data.client));
    } catch (error) {
        dispatch(getClientsRequestError(error));
    }
};
