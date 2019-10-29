import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

// Services
import { apiCall } from '../../services/apiService';
import { getTokenFromLocalStorage } from '../../services/tokenStorageService';

// Config
import { AppConfig } from '../../config';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';

// Styles
import './style.scss';
import { type } from 'os';

class JiraIcon extends Component {
    state = {
        rotateJiraIcon: false,
        isSyncOk: false,
    };

    syncTaskWithJira = event => {
        const { vocabulary, taskData, isUpdatingTask, showNotificationAction } = this.props;
        const { id } = taskData;

        if (!isUpdatingTask) {
            this.setState({ rotateJiraIcon: true });
            apiCall(AppConfig.apiURL + `sync/jira/issue/${id}/worklog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `'Bearer ${getTokenFromLocalStorage()}'`,
                },
            }).then(
                result => {
                    this.setState({ rotateJiraIcon: false, isSyncOk: true });
                },
                err =>
                    err.text().then(text => {
                        this.setState({ rotateJiraIcon: false });
                        showNotificationAction({ text: vocabulary[JSON.parse(text).message], type: 'error' });
                    })
            );
        }
    };

    render() {
        const { isSync, user } = this.props;
        const { tokenJira } = user;

        const { rotateJiraIcon, isSyncOk } = this.state;

        return tokenJira ? (
            <div
                className={classNames('wrapper-jira-icon', { 'wrapper-jira-icon--rotate-jira': rotateJiraIcon })}
                onClick={this.syncTaskWithJira}
            >
                <i className={classNames('jira-icon', { 'jira-icon-is-sync': isSync || isSyncOk })} />
            </div>
        ) : null;
    }
}

const mapStatetToProps = state => ({
    user: state.userReducer.user,
    vocabulary: state.languageReducer.vocabulary,
});

const mapDispatchToProps = {
    showNotificationAction,
};

export default connect(
    mapStatetToProps,
    mapDispatchToProps
)(JiraIcon);
