import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import MainPage from './pages/MainPage';
import ReportsPage from './pages/ReportsPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';
import ReportsByProjectsPage from './pages/ReportsByProjectPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';

import PageTemplate from './components/PageTemplate';

// styles
import 'normalize.css';
import './App.scss';
import './fonts/icomoon/icomoon.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as responsiveActions from './actions/ResponsiveActions';

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
        this.setResponsiveReducer();
        addEvent(window, 'resize', this.setResponsiveReducer);
        addEvent(window, 'resize', showMobileSupportToastr);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setResponsiveReducer);
        window.removeEventListener('resize', showMobileSupportToastr);
    }

    render() {
        return (
            <Switch>
                <Route path="/timer" render={() => <PageTemplate content={MainPage} />} />
                <Route path="/reports/summary" render={() => <PageTemplate content={ReportsPage} />} />
                <Route path="/projects" render={() => <PageTemplate content={ProjectsPage} />} />
                <Route path="/team" render={() => <PageTemplate content={TeamPage} />} />
                <Route
                    path="/reports/detailed/projects/:projectName/team/:userEmails/from/:dateStart/to/:endDate/"
                    render={() => <PageTemplate content={ReportsByProjectsPage} />}
                />

                <Route path="/login" render={() => <PageTemplate content={AuthPage} />} />
                <Route path="/register" render={() => <PageTemplate content={RegisterPage} />} />

                <Redirect from="/" to="/login" />
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
