import React from 'react';

import './style.scss';

export class AddUser extends React.Component {
    state = {
        searchFlag: true,
    };

    setFlagTrue = () => {
        this.setState({ searchFlag: true });
    };
    setFlagFalse = () => {
        this.setState({ searchFlag: false });
    };

    render() {
        const { add, cancel, v_cancel_small, v_add, peopleArr = [], projectArr = [] } = this.props;
        const { searchFlag } = this.state;
        return (
            <div className="planing-modal">
                <div className="planing-modal__header">
                    <button onClick={this.setFlagTrue}>People</button>
                    <button onClick={this.setFlagFalse}>Projects</button>
                </div>
                <div className="planing-modal__body">
                    <div>input</div>
                    {(searchFlag ? peopleArr : projectArr).map(el => (
                        <div>list</div>
                    ))}
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
