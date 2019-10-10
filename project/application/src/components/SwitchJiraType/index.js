import React, { Component } from 'react';

import classNames from 'classnames';

// styles
import './style.scss';

const jiraType = [
    {
        type: 'cloud',
        name: 'Jira Cloud',
    },
    {
        type: 'self',
        name: 'Jira self-hosted',
    },
];

class SwitchJiraType extends Component {
    state = {
        isOpenDropdown: false,
        selectedItem: null,
    };

    closeDropdown = event => {
        this.setState({ isOpenDropdown: false });
        document.removeEventListener('click', this.closeDropdown);
    };

    openDropdown = event => {
        document.addEventListener('click', this.closeDropdown);
        this.setState({ isOpenDropdown: true });
    };
    componentWillMount() {
        if (this.props.selectedType) {
            jiraType.forEach((item, index) => {
                if (item.type === this.props.selectedType) {
                    this.setState({ selectedItem: jiraType[index] });
                }
            });
            return;
        }
        this.setState({ selectedItem: jiraType[0] });
        this.props.onSelect(jiraType[0].type);
    }
    render() {
        const { dropdown, isMobile, v_type } = this.props;
        const { isOpenDropdown, selectedItem } = this.state;

        return (
            <div
                className={classNames('wrapper-switch-type', {
                    'wrapper-switch-type--dropdown': dropdown,
                    'wrapper-switch-type--block': !dropdown,
                    'wrapper-switch-type--mobile': isMobile,
                })}
            >
                <div className="wrapper-switch-type__title">Jira {v_type}</div>
                <div className="wrapper-switch-type__select" onClick={this.openDropdown}>
                    <span>{selectedItem.name}</span>

                    {isOpenDropdown && (
                        <div className="wrapper-switch-type__list">
                            {jiraType.map(item => (
                                <div
                                    key={item.name}
                                    className="wrapper-switch-type__list-item"
                                    onClick={() => {
                                        this.setState({ selectedItem: item });
                                        this.props.onSelect(item.type);
                                    }}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    )}
                    <i className="wrapper-switch-type__icon-arrow" />
                </div>
            </div>
        );
    }
}

export default SwitchJiraType;
