import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

import AddDaysModal from './AddDaysModal';

import './style.scss';

const IOSSwitch = withStyles(theme => ({
    root: {
        width: 30,
        height: 18,
        padding: 0,
        margin: 0,
    },
    switchBase: {
        padding: 3,
        color: '#696969',
        '&$checked': {
            transform: 'translateX(13px)',
            color: '#02AF67',
            '& + $track': {
                backgroundColor: '#FFFFFF',
                opacity: 1,
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
    },
    track: {
        borderRadius: 25,
        border: `1px solid #696969`,
        backgroundColor: '#FFFFFF',
        opacity: 1,
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
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

export const CloseSvg = ({ cancel }) => {
    return (
        <svg onClick={cancel} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.28273 7.50004L14.6308 2.15198C15.1231 1.65968 15.1231 0.861516 14.6308 0.369292C14.1385 -0.123003 13.3404 -0.123003 12.8481 0.369292L7.49997 5.71742L2.15185 0.369221C1.65956 -0.123074 0.861463 -0.123074 0.369168 0.369221C-0.123056 0.861516 -0.123056 1.65968 0.369168 2.15191L5.71729 7.49996L0.369168 12.8481C-0.123056 13.3404 -0.123056 14.1386 0.369168 14.6308C0.861463 15.1231 1.65956 15.1231 2.15185 14.6308L7.49997 9.28265L12.8481 14.6308C13.3403 15.1231 14.1385 15.1231 14.6308 14.6308C15.1231 14.1385 15.1231 13.3404 14.6308 12.8481L9.28273 7.50004Z"
                fill="#EB5757"
            />
        </svg>
    );
};

export class AddTimeOff extends React.Component {
    state = {
        switchAllNotifFlag: false,
        punlicNotifFlag: false,
        showAddDayFlag: false,
    };

    switchAllNotifFlag = () => {
        this.setState({ switchAllNotifFlag: !this.state.switchAllNotifFlag });
    };
    switchPublicNotifFlag = () => {
        this.setState({ punlicNotifFlag: !this.state.punlicNotifFlag });
    };
    switchShowAddDayFlag = () => {
        this.setState({ showAddDayFlag: !this.state.showAddDayFlag });
    };
    render() {
        const { add, cancel, change, changeAll, vocabulary, timeOff, allFlag } = this.props;
        const { v_add, v_cancel_small } = vocabulary;
        const { switchAllNotifFlag, punlicNotifFlag, showAddDayFlag } = this.state;
        return (
            <div className="timeoff-modal">
                <div className="timeoff-modal__header">
                    <p>Time Off</p>
                    <CloseSvg cancel={cancel} />
                </div>

                <div className="timeoff-modal__body">
                    {/* <Scrollbars renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}> */}
                    <div className="timeoff-modal__list-item">
                        <div className="timeoff-modal__list-item-left">
                            <div className="timeoff-modal__list-item-color" />
                            <p className="timeoff-modal__list-item-text">Switch all</p>
                        </div>
                        <div className="timeoff-modal__list-item-right">
                            <IOSSwitch checked={allFlag} onChange={_ => changeAll()} value={'all'} />
                            <div className="timeoff-modal__question">
                                <i onMouseOver={this.switchAllNotifFlag} onMouseOut={this.switchAllNotifFlag} />
                                {/* {switchAllNotifFlag ? ( */}
                                <div
                                    className={
                                        switchAllNotifFlag
                                            ? 'timeoff-modal__notification-show'
                                            : 'timeoff-modal__notification-hide'
                                    }
                                >
                                    Laborum ea aute id mollit nisi et in veniam deserunt duis laborum ullamco duis.
                                    Fugiat aliqua elit non dolore mollit consequat est. Labore ea est eiusmod esse non
                                    nulla nulla laboris. Ullamco sit ipsum ex non minim ut nulla culpa eu pariatur amet.
                                </div>
                                {/* ) : null} */}
                            </div>
                        </div>
                    </div>
                    <div className="timeoff-modal__list-item">
                        <div className="timeoff-modal__list-item-left">
                            <div
                                className="timeoff-modal__list-item-color"
                                style={{ background: `${timeOff[0].color}` }}
                            />
                            <p className="timeoff-modal__list-item-text">{timeOff[0].name}</p>
                        </div>
                        <div className="timeoff-modal__list-item-right">
                            <IOSSwitch
                                checked={timeOff[0].checked}
                                onChange={_ => change(timeOff[0])}
                                value={timeOff[0].name}
                            />
                            <div className="timeoff-modal__question">
                                <i onMouseOver={this.switchPublicNotifFlag} onMouseOut={this.switchPublicNotifFlag} />
                                {/* {punlicNotifFlag ? ( */}
                                <div
                                    className={
                                        punlicNotifFlag
                                            ? 'timeoff-modal__notification-show'
                                            : 'timeoff-modal__notification-hide'
                                    }
                                >
                                    Laborum ea aute id mollit nisi et in veniam deserunt duis laborum ullamco duis.
                                    Fugiat aliqua elit non dolore mollit consequat est. Labore ea est eiusmod esse non
                                    nulla nulla laboris. Ullamco sit ipsum ex non minim ut nulla culpa eu pariatur amet.
                                </div>
                                {/* ) : null} */}
                            </div>
                        </div>
                    </div>

                    {timeOff.map(item => {
                        if (item.name !== 'public holiday') {
                            return (
                                <div className="timeoff-modal__list-item" key={item.id}>
                                    <div className="timeoff-modal__list-item-left">
                                        <div
                                            className="timeoff-modal__list-item-color"
                                            style={{ background: `${item.color}` }}
                                        />
                                        <p className="timeoff-modal__list-item-text">{item.name}</p>
                                    </div>
                                    <div className="timeoff-modal__list-item-right">
                                        <IOSSwitch
                                            checked={item.checked}
                                            onChange={_ => change(item)}
                                            value={item.name}
                                        />
                                        <i className="timeoff-modal__pencil" />
                                    </div>
                                </div>
                            );
                        } else return null;
                    })}
                    <div className="timeoff-modal__add-days" onClick={this.switchShowAddDayFlag}>
                        <i className="timeoff-modal__plus" />
                        <p className="timeoff-modal__list-item-text">Add days</p>
                    </div>
                    {/* </Scrollbars> */}
                </div>
                {showAddDayFlag ? (
                    <AddDaysModal timeOff={timeOff} vocabulary={vocabulary} close={this.switchShowAddDayFlag} />
                ) : null}
            </div>
        );
    }
}
