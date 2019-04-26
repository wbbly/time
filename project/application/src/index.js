import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { store } from './store/configureStore';
import MainPage from './pages/MainPage';
import ReportsPage from './pages/ReportsPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';
import ReportsByProjectsPage from './pages/ReportsByProjectPage';
import AuthorisationPage from './pages/AuthorisationPage';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Switch>
                    <Route path="/timer" component={MainPage} />
                    <Route path="/reports/summary" component={ReportsPage} />
                    <Route
                        path="/reports/detailed/projects/:projectName/team/:userEmails/from/:dateStart/to/:endDate/"
                        component={ReportsByProjectsPage}
                    />
                    <Route path="/projects" component={ProjectsPage} />
                    <Route path="/team" component={TeamPage} />
                    <Route path="/login" component={AuthorisationPage} />

                    <Redirect from="/reports" to="/reports/summary" />
                    <Redirect from="/" to="/login" />
                </Switch>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

serviceWorker.unregister();
