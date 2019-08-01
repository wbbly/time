import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services
import { responseErrorsHandling } from '../../services/responseErrorsHandling';
import { apiCall } from '../../services/apiService';

// Components

// Actions
import { getUserTeamsAction, getCurrentTeamAction } from '../../actions/TeamActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class RenameTeamModal extends Component {
    constructor(props) {
        super(props);
        this.teamNameRef = React.createRef();
    }

    renameTeam() {
        const { vocabulary, currentTeam, getUserTeamsAction, getCurrentTeamAction } = this.props;
        const { v_a_team_existed, v_a_team_rename_error, v_a_team_name_empty_error } = vocabulary;
        const teamName = (this.teamNameRef.current.value || '').trim();
        if (teamName.length) {
            apiCall(AppConfig.apiURL + `team/rename`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamId: currentTeam.data.id,
                    newName: teamName,
                }),
            }).then(
                result => {
                    getUserTeamsAction();
                    getCurrentTeamAction();
                    this.props.closeCallback();
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(error => {
                            const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(error));
                            if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                                alert(v_a_team_existed);
                            } else {
                                alert(v_a_team_rename_error);
                            }
                        });
                    } else {
                        console.log(err);
                    }
                }
            );
        } else {
            alert(v_a_team_name_empty_error);
        }
    }

    render() {
        const { vocabulary } = this.props;
        const { v_rename_team, v_team_name, v_edit_team_name } = vocabulary;
        return (
            <div className="wrapper_rename_team_modal">
                <div className="rename_team_modal_background" />
                <div className="rename_team_modal_container">
                    <div className="rename_team_modal_header">
                        <div className="rename_team_modal_header_title">{v_edit_team_name}</div>
                        <i className="rename_team_modal_header_close" onClick={e => this.props.closeCallback()} />
                    </div>
                    <div className="rename_team_modal_data">
                        <div className="rename_team_modal_data_input_container">
                            <input type="text" ref={this.teamNameRef} placeholder={`${v_team_name}...`} />
                        </div>
                    </div>
                    <div className="rename_team_modal_button_container">
                        <button className="rename_team_modal_button_container_button" onClick={e => this.renameTeam()}>
                            {v_rename_team}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    currentTeam: state.teamReducer.currentTeam,
});

const mapDispatchToProps = {
    getUserTeamsAction,
    getCurrentTeamAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RenameTeamModal);
