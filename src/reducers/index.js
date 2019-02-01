import {combineReducers} from 'redux'
import {projectReducer} from './ProjectsReducer'
import {mainPageReducer} from "./MainPageReducer";
import {teamPageReducer} from "./TeamPageReducer";

export const rootReducer = combineReducers({
    projectReducer: projectReducer,
    mainPageReducer: mainPageReducer,
    teamPageReducer: teamPageReducer,
});