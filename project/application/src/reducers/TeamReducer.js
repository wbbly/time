import {
    GET_USER_TEAMS_REQUEST,
    GET_USER_TEAMS_REQUEST_SUCCESS,
    GET_USER_TEAMS_REQUEST_FAIL,
    GET_CURRENT_TEAM_REQUEST,
    GET_CURRENT_TEAM_REQUEST_SUCCESS,
    GET_CURRENT_TEAM_REQUEST_FAIL,
    GET_CURRENT_TEAM_DETAILED_DATA_REQUEST,
    GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_SUCCESS,
    GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_FAIL,
    ADD_INVITED_USER_TO_CURRENT_TEAM_DETAILED_DATA,
    SWITCH_TEAM_REQUEST,
    SWITCH_TEAM_REQUEST_SUCCESS,
    SWITCH_TEAM_REQUEST_FAIL,
} from '../actions/TeamActions';

const sortUserTeams = (a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
};

const sortTeamDetailedData = (a, b) => {
    if (a.user[0].username.toLowerCase() < b.user[0].username.toLowerCase()) return -1;
    if (a.user[0].username.toLowerCase() > b.user[0].username.toLowerCase()) return 1;
    return 0;
};

const initialState = {
    userTeams: {
        data: [
            {
                id: '',
                name: '',
            },
        ],
        error: null,
        isFetching: false,
        isInitialFetching: true,
    },
    currentTeam: {
        data: {
            id: '',
            name: '',
            role: '',
        },
        error: null,
        isFetching: false,
        isInitialFetching: true,
    },
    currentTeamDetailedData: {
        data: [
            {
                is_active: false,
                role_collaboration: {
                    title: '',
                },
                user: [
                    {
                        email: '',
                        id: '',
                        username: '',
                    },
                ],
            },
        ],
        error: null,
        isFetching: false,
        isInitialFetching: true,
    },
    switchTeam: {
        error: null,
        isFetching: false,
    },
};

export default (state = initialState, { type, payload, error }) => {
    switch (type) {
        // GET_USER_TEAMS
        case GET_USER_TEAMS_REQUEST: {
            return {
                ...state,
                userTeams: {
                    ...state.userTeams,
                    isFetching: true,
                },
            };
        }

        case GET_USER_TEAMS_REQUEST_SUCCESS: {
            return {
                ...state,
                userTeams: {
                    ...state.userTeams,
                    data: payload.sort(sortUserTeams),
                    error: null,
                    isFetching: false,
                    isInitialFetching: false,
                },
            };
        }

        case GET_USER_TEAMS_REQUEST_FAIL: {
            return {
                ...state,
                userTeams: {
                    ...state.userTeams,
                    error,
                    isFetching: false,
                    isInitialFetching: false,
                },
            };
        }

        // GET_CURRENT_TEAM
        case GET_CURRENT_TEAM_REQUEST: {
            return {
                ...state,
                currentTeam: {
                    ...state.currentTeam,
                    isFetching: true,
                },
            };
        }

        case GET_CURRENT_TEAM_REQUEST_SUCCESS: {
            return {
                ...state,
                currentTeam: {
                    ...state.currentTeam,
                    data: payload,
                    error: null,
                    isFetching: false,
                    isInitialFetching: false,
                },
            };
        }

        case GET_CURRENT_TEAM_REQUEST_FAIL: {
            return {
                ...state,
                currentTeam: {
                    ...state.currentTeam,
                    error,
                    isFetching: false,
                    isInitialFetching: false,
                },
            };
        }

        // GET_CURRENT_TEAM_DETAILED_DATA
        case GET_CURRENT_TEAM_DETAILED_DATA_REQUEST: {
            return {
                ...state,
                currentTeamDetailedData: {
                    ...state.currentTeamDetailedData,
                    isFetching: true,
                },
            };
        }

        case GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_SUCCESS: {
            return {
                ...state,
                currentTeamDetailedData: {
                    ...state.currentTeamDetailedData,
                    data: payload.sort(sortTeamDetailedData),
                    error: null,
                    isFetching: false,
                    isInitialFetching: false,
                },
            };
        }

        case GET_CURRENT_TEAM_DETAILED_DATA_REQUEST_FAIL: {
            return {
                ...state,
                currentTeamDetailedData: {
                    ...state.currentTeamDetailedData,
                    error,
                    isFetching: false,
                    isInitialFetching: false,
                },
            };
        }

        // ADD_INVITED_USER_TO_CURRENT_TEAM_DETAILED_DATA
        case ADD_INVITED_USER_TO_CURRENT_TEAM_DETAILED_DATA: {
            return {
                ...state,
                currentTeamDetailedData: {
                    ...state.currentTeamDetailedData,
                    data: [payload, ...state.currentTeamDetailedData.data],
                },
            };
        }

        // TEAM_SWITCH
        case SWITCH_TEAM_REQUEST: {
            return {
                ...state,
                switchTeam: {
                    ...state.switchTeam,
                    isFetching: true,
                },
            };
        }

        case SWITCH_TEAM_REQUEST_SUCCESS: {
            return {
                ...state,
                switchTeam: {
                    ...state.switchTeam,
                    error: null,
                    isFetching: false,
                },
            };
        }

        case SWITCH_TEAM_REQUEST_FAIL: {
            return {
                ...state,
                switchTeam: {
                    ...state.switchTeam,
                    error,
                    isFetching: false,
                },
            };
        }

        // RESET_FOR_ALL_REDUCERS
        case 'RESET_ALL': {
            return initialState;
        }

        default: {
            return state;
        }
    }
};
