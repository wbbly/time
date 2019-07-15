import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import jwtDecode from 'jwt-decode';

import MainPage from './pages/MainPage';
import ReportsPage from './pages/ReportsPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';
import ReportsByProjectsPage from './pages/ReportsByProjectPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import UserSettings from './pages/UserSettings';
import ResetPasswordPage from './pages/ResetPasswordPage';

import PageTemplate from './components/PageTemplate';

import { userLoggedIn } from './services/authentication';
import { getLoggedUserLanguage, getTokenFromLocalStorage } from './services/tokenStorageService';
import { setLanguage } from './actions/LanguageActions';
import { setUserDataAction } from './actions/UserSettingAction';

// styles
import 'normalize.css';
import './App.scss';
import './fonts/icomoon/icomoon.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as responsiveActions from './actions/ResponsiveActions';

const addEvent = (object, type, callback) => {
    if (object === null || typeof object === 'undefined') return false;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent('on' + type, callback);
    } else {
        object['on' + type] = callback;
    }
};

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

class App extends Component {
    setResponsiveReducer = event => {
        const { setViewportSize, setIsMobile, isMobile } = this.props;
        setViewportSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        if (window.innerWidth >= 1024 && isMobile) {
            setIsMobile(false);
        }

        if (window.innerWidth < 1024 && !isMobile) {
            setIsMobile(true);
        }
    };

    componentDidMount() {
        const { setLanguage, setUserDataAction } = this.props;
        if (userLoggedIn()) {
            setLanguage(getLoggedUserLanguage());
            setUserDataAction(jwtDecode(getTokenFromLocalStorage()));
        }
        this.setResponsiveReducer();
        addEvent(window, 'resize', this.setResponsiveReducer);
        addEvent(window, 'resize', showMobileSupportToastr);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setResponsiveReducer);
        window.removeEventListener('resize', showMobileSupportToastr);
    }

    render() {
        const redirect = to => () => <Redirect to={to} />;

        return (
            <Switch>
                <Route exact path="/" render={redirect('/login')} />

                <Route exact path="/timer" render={() => <PageTemplate content={MainPage} />} />
                <Route exact path="/reports/summary" render={() => <PageTemplate content={ReportsPage} />} />
                <Route exact path="/projects" render={() => <PageTemplate content={ProjectsPage} />} />
                <Route exact path="/team" render={() => <PageTemplate content={TeamPage} />} />
                <Route
                    exact
                    path="/reports/detailed/projects/:projectName/team/:userEmails/from/:dateStart/to/:endDate/"
                    render={() => <PageTemplate content={ReportsByProjectsPage} />}
                />

                <Route exact path="/login" render={() => <PageTemplate hideSidebar hideHeader content={AuthPage} />} />
                <Route
                    exact
                    path="/register"
                    render={() => <PageTemplate hideSidebar hideHeader content={RegisterPage} />}
                />
                <Route
                    exact
                    path="/forgot-password"
                    render={() => <PageTemplate hideSidebar hideHeader content={ForgotPassword} />}
                />
                <Route
                    exact
                    path="/reset-password"
                    render={() => <PageTemplate hideSidebar hideHeader content={ResetPasswordPage} />}
                />
                <Route exact path="/user-settings" render={() => <PageTemplate content={UserSettings} />} />

                <Route render={() => <div>404 not found</div>} />
            </Switch>
        );
    }
}

const mapStateToProps = state => ({
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    ...responsiveActions,
    setLanguage,
    setUserDataAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
