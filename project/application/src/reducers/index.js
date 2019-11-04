import { combineReducers } from 'redux';

import { projectReducer } from './ProjectsReducer';
import { mainPageReducer } from './MainPageReducer';
import { teamPageReducer } from './TeamPageReducer';
import { reportsPageReducer } from './ReportsPageReducer';
import { manualTimerModalReducer } from './ManualTimerModalReducer';
import teamReducer from './TeamReducer';
import { teamAddReducer } from './TeamAddReducer';
import responsiveReducer from './ResponsiveReducer';
import languageReducer from './LanguageReducer';
import userReducer from './UserReducer';
import notificationReducer from './NotificationReducer';

export const rootReducer = combineReducers({
    projectReducer,
    mainPageReducer,
    teamPageReducer,
    reportsPageReducer,
    manualTimerModalReducer,
    teamReducer,
    teamAddReducer,
    responsiveReducer,
    languageReducer,
    userReducer,
    notificationReducer,
});
