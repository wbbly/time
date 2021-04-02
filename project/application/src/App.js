import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PrivateRoute from './components/CustomRoutes/PrivateRoute';
import RouteInvoiceView from './components/RouteInvoiceView/RouteInvoiceView';

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
import InvoicesPageDetailed from './pages/InvoicesPageDetailed';
import InvoiceViewPage from './pages/InvoiceViewPage';

import PageTemplate from './components/PageTemplate';

// styles
import 'normalize.css';
import './App.scss';
import './fonts/icomoon/icomoon.css';

import * as responsiveActions from './actions/ResponsiveActions';
import { showNotificationAction } from './actions/NotificationActions';
import { checkAccessByRole, ROLES } from './services/authentication';

// const addEvent = (object, type, callback) => {
//     if (object === null || typeof object === 'undefined') return false;
//     if (object.addEventListener) {
//         object.addEventListener(type, callback, false);
//     } else if (object.attachEvent) {
//         object.attachEvent('on' + type, callback);
//     } else {
//         object['on' + type] = callback;
//     }
// };

class App extends Component {
    setResponsiveReducer = event => {
        const { setViewportSize, setIsMobile, isMobile } = this.props;
        setViewportSize({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
        });

        if (window.innerWidth >= 1062 && isMobile) {
            setIsMobile(false);
        }

        if (window.innerWidth < 1062 && !isMobile) {
            setIsMobile(true);
        }
    };
    connectionRestore = () => {
        const { vocabulary, showNotificationAction } = this.props;
        const { v_connection_restored } = vocabulary;
        showNotificationAction({
            type: 'connection-restored',
            text: v_connection_restored,
        });
    };

    connectionLost = () => {
        const { vocabulary, showNotificationAction } = this.props;
        const { v_connection_problem } = vocabulary;
        showNotificationAction({
            type: 'lost-connection',
            text: v_connection_problem,
        });
    };

    componentDidMount() {
        this.setResponsiveReducer();
        window.addEventListener('resize', this.setResponsiveReducer);
        window.addEventListener('online', this.connectionRestore);
        window.addEventListener('offline', this.connectionLost);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setResponsiveReducer);
        window.removeEventListener('online', this.connectionRestore);
        window.removeEventListener('offline', this.connectionLost);
    }

    render() {
        const redirect = to => () => <Redirect to={to} />;
        const { userRole } = this.props;

        return (
            <Switch>
                <Route exact path="/" render={redirect('/login')} />

                <PrivateRoute exact path="/timer" render={() => <PageTemplate content={MainPage} />} />
                <PrivateRoute exact path="/reports/summary" render={() => <PageTemplate content={ReportsPage} />} />
                <PrivateRoute exact path="/projects" render={() => <PageTemplate content={ProjectsPage} />} />
                <PrivateRoute exact path="/clients" render={() => <PageTemplate content={ClientsPage} />} />
                <PrivateRoute exact path="/team" render={() => <PageTemplate content={TeamPage} />} />
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
                <PrivateRoute
                    exact
                    path="/invoices/:pageType"
                    render={() =>
                        checkAccessByRole(userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER]) ? (
                            <PageTemplate content={InvoicesPageDetailed} />
                        ) : (
                            <Redirect to={'/invoices'} />
                        )
                    }
                />
                <PrivateRoute
                    exact
                    path="/invoices/:pageType/:invoiceId"
                    render={() =>
                        checkAccessByRole(userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER]) ? (
                            <PageTemplate content={InvoicesPageDetailed} />
                        ) : (
                            <Redirect to={'/invoices'} />
                        )
                    }
                />
                <PrivateRoute
                    exact
                    path="/invoices/view/:invoiceId"
                    render={() =>
                        checkAccessByRole(userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER]) ? (
                            <PageTemplate content={props => <InvoicesPageDetailed {...props} mode="view" />} />
                        ) : (
                            <Redirect to={'/invoices'} />
                        )
                    }
                />
                <RouteInvoiceView
                    exact
                    path="/invoice/:invoiceId"
                    render={() => <PageTemplate content={props => <InvoiceViewPage {...props} mode="view" />} />}
                />
                <PrivateRoute
                    exact
                    path="/invoices/update/:invoiceId"
                    render={() =>
                        checkAccessByRole(userRole, [ROLES.ROLE_OWNER, ROLES.ROLE_INVOICES_MANAGER]) ? (
                            <PageTemplate content={props => <InvoicesPageDetailed {...props} mode="update" />} />
                        ) : (
                            <Redirect to={'/invoices'} />
                        )
                    }
                />
                <Route render={() => <div>404 not found</div>} />
            </Switch>
        );
    }
}

const mapStateToProps = state => ({
    isMobile: state.responsiveReducer.isMobile,
    isOwner: state.teamReducer.currentTeam.data.owner_id,
    user: state.userReducer.user,
    vocabulary: state.languageReducer.vocabulary,
    userRole: state.teamReducer.currentTeam.data.role,
});

const mapDispatchToProps = {
    ...responsiveActions,
    showNotificationAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
