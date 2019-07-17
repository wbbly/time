import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

// Services
import { apiCall } from '../../services/apiService';
import { getTokenFromLocalStorage } from '../../services/tokenStorageService';

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';

class JiraIcon extends Component {
    state = {
        rotateJiraIcon: false,
        isSyncOk: false,
    };

    syncTaskWithJira = event => {
        this.setState({ rotateJiraIcon: true });
        const { vocabulary, taskData } = this.props;
        const { id } = taskData;

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
                    alert(vocabulary[JSON.parse(text).message]);
                })
        );
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
    user: state.userSettingReducer,
    vocabulary: state.languageReducer.vocabulary,
});

const mapDispatchToProps = {};

export default connect(
    mapStatetToProps,
    mapDispatchToProps
)(JiraIcon);
