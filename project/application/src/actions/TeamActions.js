import { getUserTeams, getCurrentTeam, switchTeam, getCurrentTeamDetailedData } from '../configAPI';

const formatUserTeamsData = responseData => responseData.data.user_team.map(item => item.team);

const formatCurrentTeamData = responseData => {
    const { team, role_collaboration } = responseData.data.user_team[0];

    return {
        id: team.id,
        name: team.name,
        role: role_collaboration.title,
    };
};

export const GET_USER_TEAMS_REQUEST = 'GET_USER_TEAMS_REQUEST';
export const GET_USER_TEAMS_REQUEST_SUCCESS = 'GET_USER_TEAMS_REQUEST_SUCCESS';
export const GET_USER_TEAMS_REQUEST_FAIL = 'GET_USER_TEAMS_REQUEST_FAIL';

export const GET_CURRENT_TEAM_REQUEST = 'GET_CURRENT_TEAM_REQUEST';
export const GET_CURRENT_TEAM_REQUEST_SUCCESS = 'GET_CURRENT_TEAM_REQUEST_SUCCESS';
export const GET_CURRENT_TEAM_REQUEST_FAIL = 'GET_CURRENT_TEAM_REQUEST_FAIL';

export const GET_CURRENT_TEAM_DETAILED_DATA_REQUEST = 'GET_CURRENT_TEAM_DETAILED_DATA_REQUEST';
export const GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_SUCCESS = 'GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_SUCCESS';
export const GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_FAIL = 'GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_FAIL';
export const ADD_INVITED_USER_TO_CURRENT_TEAM_DETAILED_DATA = 'ADD_INVITED_USER_TO_CURRENT_TEAM_DETAILED_DATA';

export const SWITCH_TEAM_REQUEST = 'TEAM_SWITCH_REQUEST';
export const SWITCH_TEAM_REQUEST_SUCCESS = 'TEAM_SWITCH_REQUEST_SUCCESS';
export const SWITCH_TEAM_REQUEST_FAIL = 'TEAM_SWITCH_REQUEST_FAIL';

// GET_USER_TEAMS_REQUEST
const getUserTeamsRequest = () => ({
    type: GET_USER_TEAMS_REQUEST,
});

const getUserTeamsRequestSuccess = payload => ({
    type: GET_USER_TEAMS_REQUEST_SUCCESS,
    payload,
});

const getUserTeamsRequestFail = error => ({
    type: GET_USER_TEAMS_REQUEST_FAIL,
    error,
});

export const getUserTeamsAction = () => async dispatch => {
    dispatch(getUserTeamsRequest());
    try {
        const { data } = await getUserTeams();

        dispatch(getUserTeamsRequestSuccess(formatUserTeamsData(data)));
    } catch (error) {
        dispatch(getUserTeamsRequestFail(error));
    }
};

// GET_CURRENT_TEAM_REQUEST
const getCurrentTeamRequest = () => ({
    type: GET_CURRENT_TEAM_REQUEST,
});

const getCurrentTeamRequestSuccess = payload => ({
    type: GET_CURRENT_TEAM_REQUEST_SUCCESS,
    payload,
});

const getCurrentTeamRequestFail = error => ({
    type: GET_CURRENT_TEAM_REQUEST_FAIL,
    error,
});

export const getCurrentTeamAction = () => async dispatch => {
    dispatch(getCurrentTeamRequest());
    try {
        const { data } = await getCurrentTeam();

        dispatch(getCurrentTeamRequestSuccess(formatCurrentTeamData(data)));
    } catch (error) {
        dispatch(getCurrentTeamRequestFail(error));
    }
};

// GET_CURRENT_TEAM_DETAILED_DATA_REQUEST
const getCurrentTeamDetailedDataRequest = () => ({
    type: GET_CURRENT_TEAM_DETAILED_DATA_REQUEST,
});

const getCurrentTeamDetailedDataRequestSuccess = payload => ({
    type: GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_SUCCESS,
    payload,
});

const getCurrentTeamDetailedDataRequestFail = error => ({
    type: GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_FAIL,
    error,
});

export const getCurrentTeamDetailedDataAction = () => async dispatch => {
    dispatch(getCurrentTeamDetailedDataRequest());
    try {
        const { data } = await getCurrentTeamDetailedData();

        dispatch(getCurrentTeamDetailedDataRequestSuccess(data.data.team[0].team_users));
    } catch (error) {
        dispatch(getCurrentTeamDetailedDataRequestFail(error));
    }
};

// ADD_INVITED_USER_TO_CURRENT_TEAM_DETAILED_DATA
export const addInvitedUserToCurrentTeamDetailedDataAction = payload => ({
    type: ADD_INVITED_USER_TO_CURRENT_TEAM_DETAILED_DATA,
    payload,
});

// TEAM_SWITCH_REQUEST
const switchTeamRequest = () => ({
    type: SWITCH_TEAM_REQUEST,
});

const switchTeamRequestSuccess = () => ({
    type: SWITCH_TEAM_REQUEST_SUCCESS,
});

const switchTeamRequestFail = error => ({
    type: SWITCH_TEAM_REQUEST_FAIL,
    error,
});

export const switchTeamRequestAction = data => async dispatch => {
    dispatch(switchTeamRequest());

    try {
        await switchTeam(data);

        dispatch(getUserTeamsAction());
        dispatch(getCurrentTeamAction());
        dispatch(getCurrentTeamDetailedDataAction());
        dispatch(switchTeamRequestSuccess());
    } catch (error) {
        dispatch(switchTeamRequestFail());
    }
};
