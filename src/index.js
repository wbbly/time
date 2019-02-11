import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { store } from './store/configureStore';
import MainPage from './pages/MainPage';
import ReportsPage from './pages/ReportsPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Route path="/" component={App} />
                <Route path="/main-page" component={MainPage} />
                <Route path="/reports" component={ReportsPage} />
                <Route path="/projects" component={ProjectsPage} />
                <Route path="/team" component={TeamPage} />
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

serviceWorker.unregister();
