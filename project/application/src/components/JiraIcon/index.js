import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

// Config
import { syncTaskWithJira } from '../../configAPI';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';
import { getTimeEntriesListAction } from '../../actions/MainPageAction';

// Styles
import './style.scss';

class JiraIcon extends Component {
    state = {
        rotateJiraIcon: false,
    };

    syncTaskWithJira = async event => {
        const { vocabulary, task, disableClick, showNotificationAction, getTimeEntriesListAction } = this.props;
        const { id } = task;

        if (!disableClick) {
            this.setState({ rotateJiraIcon: true });
            try {
                await syncTaskWithJira(id);
                await getTimeEntriesListAction();
            } catch (error) {
                if (error.response.data.message) {
                    showNotificationAction({ text: vocabulary[error.response.data.message], type: 'error' });
                }
            } finally {
                this.setState({ rotateJiraIcon: false });
            }
        }
    };

    render() {
        const { isSync, user } = this.props;
        const { tokenJira } = user;

        const { rotateJiraIcon } = this.state;

        return tokenJira ? (
            <div
                className={classNames('wrapper-jira-icon', { 'wrapper-jira-icon--rotate-jira': rotateJiraIcon })}
                onClick={this.syncTaskWithJira}
            >
                <i className={classNames('jira-icon', { 'jira-icon-is-sync': isSync })} />
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
    getTimeEntriesListAction,
};

export default connect(
    mapStatetToProps,
    mapDispatchToProps
)(JiraIcon);
