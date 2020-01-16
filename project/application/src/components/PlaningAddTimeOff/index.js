import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import { Scrollbars } from 'react-custom-scrollbars';

import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const IOSSwitch = withStyles(theme => ({
    root: {
        width: 34,
        height: 18,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(17px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: '1px solid #696969',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 16,
        height: 16,
    },
    track: {
        borderRadius: 50,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});
export class AddTimeOff extends React.Component {
    render() {
        const { add, cancel, change, changeAll, vocabulary, timeOff, allFlag } = this.props;
        const { v_add, v_cancel_small } = vocabulary;
        return (
            <div className="planing-modal">
                <div className="planing-modal__header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>Time Off</p>
                    <FormControlLabel
                        control={<IOSSwitch checked={allFlag} onChange={_ => changeAll()} value={'all'} />}
                    />
                </div>
                <div className="planing-modal__body">
                    <div className="add-user-modal__body-list">
                        <Scrollbars>
                            <div className="add-user-modal__list-item-container">
                                <label className="add-user-modal__list-item-label">
                                    {timeOff[0].name}
                                    <FormControlLabel
                                        control={
                                            <IOSSwitch
                                                checked={timeOff[0].checked}
                                                onChange={_ => change(timeOff[0])}
                                                value={timeOff[0].name}
                                            />
                                        }
                                    />
                                </label>
                            </div>
                            {timeOff.map(item => {
                                if (item.name !== 'public holiday') {
                                    return (
                                        <div className="add-user-modal__list-item-container" key={item.id}>
                                            <label className="add-user-modal__list-item-label">
                                                {item.name}
                                                <FormControlLabel
                                                    control={
                                                        <IOSSwitch
                                                            checked={item.checked}
                                                            onChange={_ => change(item)}
                                                            value={item.name}
                                                        />
                                                    }
                                                />
                                            </label>
                                        </div>
                                    );
                                } else return null;
                            })}
                        </Scrollbars>
                    </div>
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
