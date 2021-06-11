import { getClientsList, addClient, editClient, deleteClient, changeClientActiveStatus } from '../configAPI';

export const GET_CLIENTS_REQUEST = 'GET_CLIENTS_REQUEST';
export const GET_CLIENTS_REQUEST_SUCCESS = 'GET_CLIENTS_REQUEST_SUCCESS';
export const GET_CLIENTS_REQUEST_ERROR = 'GET_CLIENTS_REQUEST_ERROR';
export const CHANGE_CLIENTS_REQUEST = 'CHANGE_CLIENTS_REQUEST';
export const CHANGE_CLIENTS_SUCCESS = 'CHANGE_CLIENTS_SUCCESS';
export const CHANGE_CLIENTS_ERROR = 'CHANGE_CLIENTS_ERROR';
export const CHANGE_CLIENTS_SEARCH_VALUE = 'CHANGE_CLIENTS_SEARCH_VALUE';
export const CHANGE_CLIENTS_FILTER_STATUS = 'CHANGE_CLIENTS_FILTER_STATUS';

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
const changeClientsRequest = () => ({
    type: CHANGE_CLIENTS_REQUEST,
});
const changeClientsSuccess = payload => ({
    type: CHANGE_CLIENTS_SUCCESS,
    payload,
});
const changeClientsError = payload => ({
    type: CHANGE_CLIENTS_ERROR,
    payload,
});
const changeClientsSearchValue = payload => ({
    type: CHANGE_CLIENTS_SEARCH_VALUE,
    payload,
});
const changeClientsFilterStatus = payload => ({
    type: CHANGE_CLIENTS_FILTER_STATUS,
    payload,
});

export const clientsMethods = {
    statusValueToBool(status) {
        if (status === 'active') {
            return true;
        }
        if (status === 'archived') {
            return false;
        }
        return null;
    },
    checkSearchValue(value, prevState) {
        if (value === '') {
            return '';
        }
        if (!value && value !== '') {
            return prevState;
        }
        return value;
    },
    checkOnValue(value, prevState) {
        if (!value) {
            return prevState;
        }
        return value;
    },
};

export const resetClientsParamsAction = () => dispatch => {
    dispatch(changeClientsSearchValue(''));
    dispatch(changeClientsFilterStatus('all'));
};

export const getClientsAction = ({ searchValue, filterStatus } = {}) => async (dispatch, getState) => {
    dispatch(
        changeClientsFilterStatus(clientsMethods.checkOnValue(filterStatus, getState().clientsReducer.filterStatus))
    );
    dispatch(
        changeClientsSearchValue(clientsMethods.checkSearchValue(searchValue, getState().clientsReducer.searchValue))
    );
    dispatch(getClientsRequest());

    try {
        const { data } = await getClientsList({
            order_by: 'company_name',
            sort: 'asc',
            isActive: clientsMethods.statusValueToBool(
                clientsMethods.checkOnValue(filterStatus, getState().clientsReducer.filterStatus)
            ),
            search: clientsMethods.checkSearchValue(searchValue, getState().clientsReducer.searchValue),
        });
        dispatch(getClientsRequestSuccess(data.data.client));
    } catch (error) {
        dispatch(getClientsRequestError(error));
    }
};

export const changeClientActiveStatusAction = (clientId, status) => async dispatch => {
    try {
        await changeClientActiveStatus(clientId, status);
    } catch (error) {
        console.log('error', error);
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

export const addClientAction = (client, logoFile, params = { order_by: 'company_name', sort: 'asc' }) => async (
    dispatch,
    getState
) => {
    dispatch(changeClientsRequest());
    let formData = logoFile;
    try {
        let requestBody = {
            name: client.name || client.username,
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
        await addClient(requestBody);
        const { filterStatus, searchValue } = getState().clientsReducer;
        const { data } = await getClientsList({
            ...params,
            isActive: clientsMethods.statusValueToBool(filterStatus),
            search: searchValue,
        });
        dispatch(changeClientsSuccess(data.data.client));
        return data.data.client;
    } catch (error) {
        dispatch(changeClientsError(error));
    }
};

export const editClientThunk = (client, id, logoFile, params = { order_by: 'company_name', sort: 'asc' }) => async (
    dispatch,
    getState
) => {
    dispatch(changeClientsRequest());
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

        await editClient(requestBody, id);
        const { filterStatus, searchValue } = getState().clientsReducer;
        const { data } = await getClientsList({
            ...params,
            isActive: clientsMethods.statusValueToBool(filterStatus),
            search: searchValue,
        });
        dispatch(changeClientsSuccess(data.data.client));
    } catch (error) {
        dispatch(changeClientsError(error));
    }
};

export const deleteClientThunk = (id, params = { order_by: 'company_name', sort: 'asc' }) => async (
    dispatch,
    getState
) => {
    dispatch(changeClientsRequest());
    try {
        await deleteClient(id);
        const { filterStatus, searchValue } = getState().clientsReducer;
        const { data } = await getClientsList({
            ...params,
            isActive: clientsMethods.statusValueToBool(filterStatus),
            search: searchValue,
        });
        dispatch(changeClientsSuccess(data.data.client));
    } catch (error) {
        dispatch(changeClientsError(error));
    }
};
