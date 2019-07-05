import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services

// Components

// Actions

// Queries

// Config

// Styles
import './style.css';

class CreateTeamModal extends Component {
    addTeam() {
        const { vocabulary } = this.props;
        const { v_a_team_name_empty_error } = vocabulary;
        const createTeam = (this.createTeamInput.value || '').trim();
        if (createTeam.length) {
            this.props.createTeamRequest(createTeam);
            this.closeModal();
        } else {
            alert(v_a_team_name_empty_error);
        }
    }

    getWrapper() {
        return document.querySelector('.wrapper');
    }

    addZIndexToWrapper() {
        const wrapper = this.getWrapper();
        if (wrapper) {
            wrapper.classList.add('wrapper_z-index-1');
        }
    }

    removeZIndexFromWrapper() {
        const wrapper = this.getWrapper();
        if (wrapper) {
            wrapper.classList.remove('wrapper_z-index-1');
        }
    }

    closeModal() {
        this.removeZIndexFromWrapper();
        this.props.teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: false });
    }

    render() {
        const { vocabulary } = this.props;
        const { v_team_name, v_create_team } = vocabulary;

        this.addZIndexToWrapper();

        return (
            <div className="wrapper_create_team_modal">
                <div className="create_team_modal_background" />
                <div className="create_team_modal_container">
                    <div className="create_team_modal_header">
                        <div className="create_team_modal_header_title">{v_create_team}</div>
                        <i className="create_team_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="create_team_modal_data">
                        <div className="create_team_modal_data_input_container">
                            <input
                                type="text"
                                ref={input => {
                                    this.createTeamInput = input;
                                }}
                                placeholder={`${v_team_name}...`}
                            />
                        </div>
                    </div>
                    <div className="create_team_modal_button_container">
                        <button className="create_team_modal_button_container_button" onClick={e => this.addTeam()}>
                            {v_create_team}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(CreateTeamModal);
