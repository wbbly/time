import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PrivateRoute from './components/CustomRoutes/PrivateRoute';

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
import ClientsPage from './pages/ClientsPage';
import InvoicesPage from './pages/InvoicesPage';
import PlaningPage from './pages/PlaningPage';

import PageTemplate from './components/PageTemplate';

// styles
import 'normalize.css';
import './App.scss';
import './fonts/icomoon/icomoon.css';

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
        this.setResponsiveReducer();
        addEvent(window, 'resize', this.setResponsiveReducer);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setResponsiveReducer);
    }

    render() {
        const redirect = to => () => <Redirect to={to} />;

        return (
            <Switch>
                <Route exact path="/" render={redirect('/login')} />

                <PrivateRoute exact path="/timer" render={() => <PageTemplate content={MainPage} />} />
                <PrivateRoute exact path="/reports/summary" render={() => <PageTemplate content={ReportsPage} />} />
                <PrivateRoute exact path="/projects" render={() => <PageTemplate content={ProjectsPage} />} />
                <PrivateRoute exact path="/clients" render={() => <PageTemplate content={ClientsPage} />} />
                <PrivateRoute exact path="/team" render={() => <PageTemplate content={TeamPage} />} />
                <PrivateRoute path="/planing" render={() => <PageTemplate content={PlaningPage} />} />
                <PrivateRoute
                    exact
                    path="/reports/detailed/projects/:projectName/team/:userEmails/from/:dateStart/to/:endDate/"
                    render={() => <PageTemplate content={ReportsByProjectsPage} />}
                />
                <PrivateRoute exact path="/user-settings" render={() => <PageTemplate content={UserSettings} />} />

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
                <PrivateRoute exact path="/invoices" render={() => <PageTemplate content={InvoicesPage} />} />

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
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
