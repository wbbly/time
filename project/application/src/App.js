import React, { Component } from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';

import MainPage from './pages/MainPage';
import ReportsPage from './pages/ReportsPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';
import ReportsByProjectsPage from './pages/ReportsByProjectPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { setViewportSize } from './actions/ResponsiveActions';

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

store.dispatch(
    setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
    })
);

addEvent(window, 'resize', event => {
    store.dispatch(
        setViewportSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    );
});

toast.configure();

let mobileSupportToastr;
const mobileSupportToastrText = 'We were sorry! Wobbly not yet support mobile, but it should be done soon!';
export const showMobileSupportToastr = () => {
    const { pathname } = window.location;
    const arrayOfResponsiveRoutes = ['/timer', '/register', '/login', '/'];
    if (window.innerWidth <= 1024 && arrayOfResponsiveRoutes.indexOf(pathname) === -1) {
        if (!mobileSupportToastr) {
            mobileSupportToastr = toast(mobileSupportToastrText, {
                position: 'top-right',
                className: 'mobile-support-toastr',
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                onClose: () => {
                    mobileSupportToastr = undefined;
                },
            });
        }
    } else {
        toast.dismiss(mobileSupportToastr);
        mobileSupportToastr = undefined;
    }
};

// showMobileSupportToastr();

addEvent(window, 'resize', event => {
    showMobileSupportToastr();
});

class App extends Component {
    render() {
        return (
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
            </Provider>
        );
    }
}

export default App;
