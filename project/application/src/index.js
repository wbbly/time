import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import './fonts/icomoon/icomoon.css';
import { store } from './store/configureStore';
import MainPage from './pages/MainPage';
import ReportsPage from './pages/ReportsPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';
import ReportsByProjectsPage from './pages/ReportsByProjectPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';

toast.configure();

const addEvent = (object, type, callback) => {
    if (object === null || typeof object === 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent('on' + type, callback);
    } else {
        object['on' + type] = callback;
    }
};

let mobileSupportToastr;
const mobileSupportToastrText = 'We were sorry! Wobbly not yet support mobile, but it should be done soon!';
const showMobileSupportToastr = () => {
    if (window.innerWidth <= 800) {
        if (!mobileSupportToastr) {
            mobileSupportToastr = toast(mobileSupportToastrText, {
                position: 'top-right',
                className: 'mobile-support-toastr',
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    } else {
        toast.dismiss(mobileSupportToastr);
        mobileSupportToastr = undefined;
    }
};

showMobileSupportToastr();
addEvent(window, 'resize', event => {
    showMobileSupportToastr();
});

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
                    <Route path="/login" component={AuthPage} />
                    <Route path="/register" component={RegisterPage} />

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
