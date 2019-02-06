import { combineReducers } from 'redux'
import { projectReducer } from './ProjectsReducer'
import { mainPageReducer } from './MainPageReducer';
import { teamPageReducer } from './TeamPageReducer';
import { reportsPageReducer } from './ReportsPageReducer';

export const rootReducer = combineReducers({
    projectReducer: projectReducer,
    mainPageReducer: mainPageReducer,
    teamPageReducer: teamPageReducer,
    reportsPageReducer: reportsPageReducer,
});