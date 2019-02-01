import { combineReducers } from 'redux'
import { projectReducer } from './ProjectsReducer'

export const rootReducer = combineReducers({
    projectReducer: projectReducer,
});