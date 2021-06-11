import React, { useState, useEffect, useRef } from 'react';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Checkbox from '@material-ui/core/Checkbox';

import { useOutsideClick } from '../../services/hookHelpers';

import './style.scss';

const materialTheme = createMuiTheme({
    overrides: {
        MuiSvgIcon: {
            root: {
                fontSize: '24px',
            },
        },
    },
});

const CloseSVG = () => (
    <svg width="10" height="10" viewBox="0 0 6 6" fill="#333333" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.0461 0.0360539C4.99803 -0.012018 4.91934 -0.012018 4.87127 0.0360539L3.08743 1.81988C3.03936 1.86795 2.96067 1.86795 2.9126 1.81988L1.1288 0.0360539C1.08073 -0.012018 1.00204 -0.012018 0.953971 0.0360539L0.0360541 0.953931C-0.012018 1.002 -0.012018 1.08069 0.0360541 1.12876L1.81989 2.91259C1.86796 2.96066 1.86796 3.03934 1.81989 3.08741L0.0360541 4.87124C-0.012018 4.91931 -0.012018 4.998 0.0360541 5.04607L0.953937 5.96395C1.00201 6.01202 1.08069 6.01202 1.12877 5.96395L2.9126 4.18012C2.96067 4.13205 3.03936 4.13205 3.08743 4.18012L4.87123 5.96391C4.91931 6.01198 4.99799 6.01198 5.04606 5.96391L5.96395 5.04603C6.01202 4.99796 6.01202 4.91928 5.96395 4.87121L4.18014 3.08741C4.13207 3.03934 4.13207 2.96066 4.18014 2.91259L5.96395 1.12879C6.01202 1.08072 6.01202 1.00204 5.96395 0.953965L5.0461 0.0360539Z"
            fill="#333333"
        />
    </svg>
);

const UsersSelectComponent = ({ users, selectedUsers, toggleSelect, vocabulary, closePopup }) => {
    const [value, setValue] = useState('');
    const [filteredArray, setFilteredArray] = useState([]);
    const wrapperRef = useRef(null);

    useOutsideClick(wrapperRef, () => closePopup());

    const { v_find, v_select_all, v_select_none } = vocabulary;

    useEffect(
        () => {
            const filtered = users.filter(
                item => `${item.username.toLowerCase()} ${item.email.toLowerCase()}`.indexOf(value.trim()) >= 0
            );
            setFilteredArray(filtered);
        },
        [value, users]
    );

    const selectItem = item => {
        if (selectedUsers.some(selectedItem => selectedItem.id === item.id)) {
            toggleSelect(selectedUsers.filter(selectedItem => selectedItem.id !== item.id));
        } else {
            toggleSelect([...selectedUsers, item]);
        }
    };

    return (
        <div className="user_select_body" ref={wrapperRef}>
            <div className="search_menu_select">
                <input
                    type="text"
                    // onKeyUp={_ => this.findUser(this.state.userDataEtalon, this.smallSelectUserInputRef.value)}
                    onChange={e => setValue(e.target.value)}
                    placeholder={`${v_find}...`}
                    value={value}
                />
                <div onClick={() => toggleSelect(users)}>{v_select_all}</div>
                <div onClick={() => toggleSelect([])}>{v_select_none}</div>
                <span className="small_clear" onClick={() => setValue('')}>
                    <CloseSVG />
                </span>
            </div>
            <div className="select_items_container">
                {filteredArray.map(item => (
                    <div className="select_users_item" key={item.id}>
                        <label>
                            <ThemeProvider theme={materialTheme}>
                                <Checkbox
                                    color={'primary'}
                                    // value={item.email || ''}
                                    checked={selectedUsers.some(selectedItem => selectedItem.id === item.id)}
                                    onChange={() => {
                                        selectItem(item);
                                    }}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            </ThemeProvider>
                            <span className="select_users_item_username">{item.username}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersSelectComponent;
