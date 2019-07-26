import { combineReducers } from 'redux';

import { projectReducer } from './ProjectsReducer';
import { mainPageReducer } from './MainPageReducer';
import { teamPageReducer } from './TeamPageReducer';
import { reportsPageReducer } from './ReportsPageReducer';
import { manualTimerModalReducer } from './ManualTimerModalReducer';
import { authPageReducer } from './AuthPageReducer';
import { teamReducer } from './TeamReducer';
import { teamAddReducer } from './TeamAddReducer';
import responsiveReducer from './ResponsiveReducer';
import languageReducer from './LanguageReducer';
import userReducer from './UserReducer';

export const rootReducer = combineReducers({
    projectReducer,
    mainPageReducer,
    teamPageReducer,
    reportsPageReducer,
    manualTimerModalReducer,
    authPageReducer,
    teamReducer,
    teamAddReducer,
    responsiveReducer,
    languageReducer,
    userReducer,
});
