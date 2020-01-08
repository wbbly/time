import { combineReducers } from 'redux';

import { projectReducer } from './ProjectsReducer';
import { mainPageReducer } from './MainPageReducer';
import { teamPageReducer } from './TeamPageReducer';
import { reportsPageReducer } from './ReportsPageReducer';
import teamReducer from './TeamReducer';
import { teamAddReducer } from './TeamAddReducer';
import responsiveReducer from './ResponsiveReducer';
import languageReducer from './LanguageReducer';
import userReducer from './UserReducer';
import notificationReducer from './NotificationReducer';
import clientsReducer from './ClientsReducer';
import { planingReducer } from './PlaningReducer';

export const rootReducer = combineReducers({
    projectReducer,
    mainPageReducer,
    teamPageReducer,
    reportsPageReducer,
    teamReducer,
    teamAddReducer,
    responsiveReducer,
    languageReducer,
    userReducer,
    notificationReducer,
    clientsReducer,
    planingReducer,
});
