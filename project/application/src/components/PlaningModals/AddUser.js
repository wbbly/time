import React from 'react';

import './style.scss';

export class AddUser extends React.Component {
    state = {
        searchFlag: true,
    };

    render() {
        const { add, cancel, v_cancel_small, v_add } = this.props;
        return (
            <div className="planing-modal">
                <div className="planing-modal__header">
                    <button>People</button>
                    <button>Projects</button>
                </div>
                <div className="planing-modal__body">
                    <div>input</div>
                    <div>list</div>
                </div>
                <div className="planing-modal__footer">
                    <button className="planing-modal__add-btn" onClick={e => add('hello')}>
                        {v_add}
                    </button>
                    <button className="planing-modal__cancel-btn" onClick={cancel}>
                        {v_cancel_small}
                    </button>
                </div>
            </div>
        );
    }
}
