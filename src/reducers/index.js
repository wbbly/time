import {combineReducers} from 'redux'
import {projectReducer} from './ProjectsReducer'
import {mainPageReducer} from "./MainPageReducer";

export const rootReducer = combineReducers({
    projectReducer: projectReducer,
    mainPageReducer: mainPageReducer,
});