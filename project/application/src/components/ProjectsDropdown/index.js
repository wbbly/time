import React, { Component } from 'react';

import './style.scss';

class ProjectsDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            relationProjectsList: [],
            showList: false,
            inputValue: '',
            selectedItem: null,
        };

        this.searchProjectInput = React.createRef();
    }

    closeDropdown = e => {
        const { showList } = this.state;
        if (showList && !e.target.closest('.projects_list_wrapper')) {
            this.setState({ showList: false });
        }
    };

    searchProject = e => {
        let targetValue = e.target.value;
        let afterSearch = this.props.relationProjectsList.filter(
            obj => obj.name.toLowerCase().indexOf(targetValue.toLowerCase().trim()) !== -1
        );
        this.setState({
            relationProjectsList: afterSearch,
            inputValue: targetValue,
        });
    };

    projectSelect = (name, id) => {
        this.setState({ inputValue: '', showList: false, selectedItem: { name, id } });
        this.props.projectSelect(id);
    };

    removeSelectedProject = event => {
        event.stopPropagation();
        this.setState({ selectedItem: null });
        this.props.projectSelect(null);
    };

    removeSelectedClient = event => {
        event.stopPropagation();
        this.setState({ selectedItem: null });
        this.props.projectSelect(null);
    };

    getClientFullName(client, listView = true) {
        const { company_name, name } = client;
        // returns 'Company (Client Name)' for list visualization, or 'company clientname' for search
        if (listView) {
            return company_name ? `${company_name}${name ? ` (${name})` : ''}` : name;
        } else {
            return (company_name ? `${company_name}${name ? ` ${name}` : ''}` : name).toLowerCase();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { showList } = this.state;
        const { relationProjectsList, selectedProject } = this.props;
        if (prevProps.relationProjectsList !== relationProjectsList) {
            this.setState({
                relationProjectsList,
                selectedItem: selectedProject
                    ? relationProjectsList.filter(item => +item.id === selectedProject)[0]
                    : null,
            });
        }
        if (prevState.showList !== showList) {
            if (showList) {
                this.searchProjectInput.current.focus();
            } else {
                this.setState({
                    inputValue: '',
                    relationProjectsList,
                });
            }
        }
    }

    componentDidMount() {
        this.setState({ inputValue: '' });
        document.addEventListener('mousedown', this.closeDropdown);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.closeDropdown);
    }

    render() {
        const { relationProjectsList, showList, inputValue, selectedItem } = this.state;
        const { vocabulary } = this.props;
        const { v_sync_with_jira_project, v_projects, v_find, v_empty } = vocabulary;
        return (
            <div className="projects_list_wrapper" data-label={v_sync_with_jira_project}>
                {selectedItem && (
                    <div className="projects_clear" onClick={this.removeSelectedClient}>
                        <p>Clear field</p>
                        <i className="client-remove" />
                    </div>
                )}
                <div className="projects_list_container">
                    <div className="projects_list_select-title">
                        <span>
                            {selectedItem ? (
                                this.getClientFullName(selectedItem)
                            ) : (
                                <span className="projects-select-placeholder">{`${v_projects}...`}</span>
                            )}
                        </span>
                    </div>
                    <div
                        className="projects-vector-container"
                        onClick={e => {
                            this.setState({ showList: !showList });
                        }}
                    >
                        <i className={`projects-vector ${showList ? 'projects-vector_up' : ''}`} />
                    </div>
                </div>

                {showList && (
                    <div className="projects_list_dropdown">
                        <div className="projects_list_input">
                            <input
                                ref={this.searchProjectInput}
                                placeholder={`${v_find}...`}
                                type="text"
                                value={inputValue}
                                onChange={this.searchProject}
                            />
                        </div>
                        <div className="projects_list">
                            {relationProjectsList.length === 0 && <div className="empty-list">{v_empty}</div>}
                            {relationProjectsList.map(project => {
                                return (
                                    <div
                                        key={project.id}
                                        className="projects_list_item"
                                        onClick={e => this.projectSelect(project.name, project.id)}
                                    >
                                        <div className="projects_list_item_name">{project.name}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ProjectsDropdown;
