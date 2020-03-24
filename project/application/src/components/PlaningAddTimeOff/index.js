import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

import AddDaysModal from './AddDaysModal';

import './style.scss';
import { ThemeProvider } from "@material-ui/styles";
import Checkbox from "@material-ui/core/Checkbox";
import { createMuiTheme } from "@material-ui/core";

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

export const PencilSvg = ({ openFlag, action, id }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={_ => action(id)}
        >
            <path
                d="M11.1929 3.00397L14.8545 6.68347L5.58597 15.9974L1.92644 12.3179L11.1929 3.00397ZM17.633 2.11656L16 0.475623C15.369 -0.158541 14.3442 -0.158541 13.711 0.475623L12.1468 2.04747L15.8084 5.72701L17.633 3.89354C18.1224 3.40164 18.1224 2.60842 17.633 2.11656ZM0.0102504 17.4897C-0.0563861 17.7911 0.21438 18.0611 0.514313 17.9879L4.59456 16.9937L0.935028 13.3142L0.0102504 17.4897Z"
                fill={openFlag ? '#D5D5D5' : '#6D6D6D'}
            />
        </svg>
    );
};
const materialTheme = createMuiTheme({
    overrides: {
        MuiSvgIcon: {
            root: {
                fontSize: '24px',
            },
        },
    },
});
export class AddTimeOff extends React.Component {
    state = {
        switchAllNotifFlag: false,
        publicNotifFlag: false,
        showAddDayFlag: false,
        timeOffArray:[],
        userDataSelected: [],
    };

    componentDidMount() {
        this.props.getTimeOff().then((res)=>{
            this.setState({timeOffArray:res.payload})
        })
    }

    toggleUser(user) {
        let daysOff = JSON.parse(JSON.stringify(this.state.userDataSelected));
        let exists = false;
        for (let i = 0; i < daysOff.length; i++) {
            const currentUser = daysOff[i];
            if (currentUser === user.id) {
                exists = true;
                daysOff.splice(i, 1);
                break;
            }
        }

        if (!exists) {
            daysOff.push(user.id);
        }
        console.log(daysOff)
        this.setState({ userDataSelected: daysOff });
        // this.props.getTimerPlaningList(daysOff);
    }
    selectAllUsers() {
        this.setState({ userDataSelected: this.state.timeOffArray });
        // this.props.getTimerPlaningList(this.state.timeOffArray.map((item)=>{return item.id});
    }
    selectNoneUsers() {
        this.setState({ userDataSelected: [] });
        // this.props.getTimerPlaningList([]);
    }
    getCheckedUsers(name) {
        if (JSON.stringify(this.state.userDataSelected).indexOf(name) > -1) {
            return true;
        }
    }

    findDays(items, searchText = '') {
        if (searchText.length > 0) {
            searchText = searchText.toLowerCase();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it['title']);

                return values
                  .join()
                  .toLowerCase()
                  .indexOf(searchText) > -1
                  ? it
                  : undefined;
            });
            this.setState({ timeOffArray: filteredArr });
        } else {
            this.setState({ timeOffArray: items });
        }
    }

    switchAllNotifFlag = () => {
        this.setState({ switchAllNotifFlag: !this.state.switchAllNotifFlag });
    };
    switchPublicNotifFlag = () => {
        this.setState({ publicNotifFlag: !this.state.publicNotifFlag });
    };
    switchShowAddDayFlag = () => {
        this.setState({ showAddDayFlag: !this.state.showAddDayFlag });
    };
    render() {
        const { add, cancel, change, changeAll, vocabulary, timeOff, allFlag, openDayOffChangeWindow, newtimeOff } = this.props;
        // const { v_add, v_cancel_small } = vocabulary;
        const { v_user, v_project, v_find, v_select_all, v_select_none, v_apply, v_client } = vocabulary;
        const { switchAllNotifFlag, publicNotifFlag, showAddDayFlag , timeOffArray} = this.state;
        console.log(timeOffArray)
        return (
            <div className="timeoff-modal">
                <div className="timeoff-modal__header">
                    <p>Filter days</p>
                    <CloseSvg cancel={cancel} />
                </div>

                <div className="timeoff-modal__body">
                    {/* <Scrollbars renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}> */}
                    {/*<div className="timeoff-modal__list-item">*/}
                    {/*    <div className="timeoff-modal__list-item-left">*/}
                    {/*        <div className="timeoff-modal__list-item-text">Switch all</div>*/}
                    {/*    </div>*/}
                    {/*    <div className="timeoff-modal__list-item-right">*/}
                    {/*        <IOSSwitch checked={allFlag} onChange={_ => changeAll()} value={'all'} />*/}
                    {/*        <div className="timeoff-modal__question">*/}
                    {/*            <i onMouseOver={this.switchAllNotifFlag} onMouseOut={this.switchAllNotifFlag} />*/}
                    {/*            /!* {switchAllNotifFlag ? ( *!/*/}
                    {/*            <div*/}
                    {/*                className={*/}
                    {/*                    switchAllNotifFlag*/}
                    {/*                        ? 'timeoff-modal__notification-show'*/}
                    {/*                        : 'timeoff-modal__notification-hide'*/}
                    {/*                }*/}
                    {/*            >*/}
                    {/*                Laborum ea aute id mollit nisi et in veniam deserunt duis laborum ullamco duis.*/}
                    {/*                Fugiat aliqua elit non dolore mollit consequat est. Labore ea est eiusmod esse non*/}
                    {/*                nulla nulla laboris. Ullamco sit ipsum ex non minim ut nulla culpa eu pariatur amet.*/}
                    {/*            </div>*/}
                    {/*            /!* ) : null} *!/*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="timeoff-modal__list-item">*/}
                    {/*    <div className="timeoff-modal__list-item-left">*/}
                    {/*        <div*/}
                    {/*            className="timeoff-modal__list-item-color"*/}
                    {/*            style={{ background: `${timeOff[0].color}` }}*/}
                    {/*        />*/}
                    {/*        <p className="timeoff-modal__list-item-text">{timeOff[0].name}</p>*/}
                    {/*    </div>*/}
                    {/*    <div className="timeoff-modal__list-item-right">*/}
                    {/*        <IOSSwitch*/}
                    {/*            checked={timeOff[0].checked}*/}
                    {/*            onChange={_ => change(timeOff[0])}*/}
                    {/*            value={timeOff[0].name}*/}
                    {/*        />*/}
                    {/*        <div className="timeoff-modal__question">*/}
                    {/*            <i onMouseOver={this.switchPublicNotifFlag} onMouseOut={this.switchPublicNotifFlag} />*/}
                    {/*            /!* {publicNotifFlag ? ( *!/*/}
                    {/*            <div*/}
                    {/*                className={*/}
                    {/*                    publicNotifFlag*/}
                    {/*                        ? 'timeoff-modal__notification-show'*/}
                    {/*                        : 'timeoff-modal__notification-hide'*/}
                    {/*                }*/}
                    {/*            >*/}
                    {/*                Laborum ea aute id mollit nisi et in veniam deserunt duis laborum ullamco duis.*/}
                    {/*                Fugiat aliqua elit non dolore mollit consequat est. Labore ea est eiusmod esse non*/}
                    {/*                nulla nulla laboris. Ullamco sit ipsum ex non minim ut nulla culpa eu pariatur amet.*/}
                    {/*            </div>*/}
                    {/*            /!* ) : null} *!/*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*{timeOff.map(item => {*/}
                    {/*    if (item.name !== 'public holiday') {*/}
                    {/*        return (*/}
                    {/*            <div className="timeoff-modal__list-item" key={item.id}>*/}
                    {/*                <div className="timeoff-modal__list-item-left">*/}
                    {/*                    <div*/}
                    {/*                        className="timeoff-modal__list-item-color"*/}
                    {/*                        style={{ background: `${item.color}` }}*/}
                    {/*                    />*/}
                    {/*                    <p className="timeoff-modal__list-item-text">{item.name}</p>*/}
                    {/*                </div>*/}
                    {/*                <div className="timeoff-modal__list-item-right">*/}
                    {/*                    <IOSSwitch*/}
                    {/*                        checked={item.checked}*/}
                    {/*                        onChange={_ => change(item)}*/}
                    {/*                        value={item.name}*/}
                    {/*                    />*/}
                    {/*                    <div className="timeoff-modal__pencil">*/}
                    {/*                        <PencilSvg*/}
                    {/*                            openFlag={item.openFlag}*/}
                    {/*                            action={openDayOffChangeWindow}*/}
                    {/*                            id={item.id}*/}
                    {/*                        />*/}
                    {/*                        {item.openFlag ? (*/}
                    {/*                            <AddDaysModal*/}
                    {/*                                timeOff={timeOff}*/}
                    {/*                                vocabulary={vocabulary}*/}
                    {/*                                close={openDayOffChangeWindow}*/}
                    {/*                                initialColor={item.colorName}*/}
                    {/*                                initialName={item.name}*/}
                    {/*                                itemId={item.id}*/}
                    {/*                            />*/}
                    {/*                        ) : null}*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        );*/}
                    {/*    } else return null;*/}
                    {/*})}*/}
                    {/*{newtimeOff.map((item)=>{*/}
                    {/*    return <div>*/}
                    {/*        {item.title}*/}
                    {/*    </div>*/}
                    {/*})}*/}
                      <div className="filter_block" ref={div => (this.selectListUsersRef = div)}>
                          <div className="search_menu_select">
                              <input
                                type="text"
                                onKeyUp={_ =>
                                  this.findDays(newtimeOff, this.smallSelectDaysInputRef.value)
                                }
                                ref={input => (this.smallSelectDaysInputRef = input)}
                                // placeholder={`${v_find}...`}
                                placeholder='Search'
                              />
                              <div ref={div => (this.selectAllUsersRef = div)} onClick={_ => this.selectAllUsers()}>
                                  {v_select_all}
                              </div>
                              <div ref={div => (this.selectNoneUsersRef = div)} onClick={_ => this.selectNoneUsers()}>
                                  {v_select_none}
                              </div>
                              {/*<i className="small_clear" onClick={_ => this.clearUserSearch()} />*/}
                          </div>
                          <div className="select_items_container">
                              {timeOffArray.map((item, index) => (
                                <div className="select_users_item" key={item.id + index}>
                                    <label>
                                        <ThemeProvider theme={materialTheme}>
                                            <Checkbox
                                              color={'primary'}
                                              value={item.title || ''}
                                              checked={this.getCheckedUsers(item.title)}
                                              onChange={_ => {
                                                  this.toggleUser(item);
                                              }}
                                            />
                                        </ThemeProvider>{' '}
                                        <span className="select_users_item_username">{item.title}</span>
                                    </label>
                                </div>
                              ))}
                          </div>
                      </div>

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
