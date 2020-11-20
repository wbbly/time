import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.scss';

class SelectTeamRoleAccess extends Component {
    state = {
        isOpenDropdown: false,
        value: this.props.value,
        list: {
            role: ['all', 'member', 'admin'],
            access: ['all', 'granted', 'denied'],
        },
    };

    tooggleDropdown = event => {
        if (this.state.isOpenDropdown) {
            document.removeEventListener('click', this.tooggleDropdown);
        } else {
            document.addEventListener('click', this.tooggleDropdown);
        }
        this.setState({ isOpenDropdown: !this.state.isOpenDropdown });
    };

    setValue = value => {
        const { setTeamRoleAccess } = this.props;
        setTeamRoleAccess(value);
        this.setState({ value });
        this.tooggleDropdown();
    };

    componentDidMount() {}

    render() {
        const { value, list, isOpenDropdown } = this.state;
        const { vocabulary, type } = this.props;
        const { v_all_role, v_all_access, v_active, v_not_active } = vocabulary;
        const listMap = {
            role: {
                all: v_all_role,
                member: 'Member',
                admin: 'Admin',
            },
            access: {
                all: v_all_access,
                granted: v_active,
                denied: v_not_active,
            },
        };

        return (
            <div className="team-role-access">
                <div className="team-role-access_select">
                    <div onClick={this.tooggleDropdown}>
                        <span>{listMap[type][value]}</span>
                        <i
                            className={`team-role-access__icon-arrow ${
                                isOpenDropdown ? 'team-role-access__icon-arrow-open' : ''
                            }`}
                        />
                    </div>

                    {isOpenDropdown && (
                        <div className="team-role-access__list">
                            {list[type].map(item => (
                                <div
                                    key={item}
                                    className="team-role-access__list-item"
                                    onClick={event => {
                                        this.setValue(item);
                                    }}
                                >
                                    {listMap[type][item]}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(SelectTeamRoleAccess);
