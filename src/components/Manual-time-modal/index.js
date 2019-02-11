import React, { Component } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

class ManualTimeModal extends Component {
    render() {
        return (
            <div className="manual_time_modal_wrapper">
                <div className="manual_time_modal_background" />
                <div className="manual_time_modal_container">
                    <i
                        className="create_projects_modal_header_close manual_time_modal_close"
                        onClick={e => {
                            this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: false });
                        }}
                    />
                    <div>
                        <span>Task name:</span>
                        <input type="text" />
                    </div>
                    <div className="manual_timer_modal_timepickers_container">
                        <div>
                            <span> Time start:</span>
                            <input type="time" />
                        </div>
                        <div>
                            <span>Time start:</span>
                            <input type="time" />
                        </div>
                    </div>
                    <button className="create_projects_modal_button_container_button manual_time_button">Change</button>
                </div>
            </div>
        );
    }
}

export default ManualTimeModal;
