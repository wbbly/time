import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';

// Styles
import './style.scss';

const FolderIcon = ({ className }) => (
    <svg
        className={className}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9.99935 1.66602L1.66602 5.83268L9.99935 9.99935L18.3327 5.83268L9.99935 1.66602Z"
            stroke="#C1C0C0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1.66602 14.166L9.99935 18.3327L18.3327 14.166"
            stroke="#C1C0C0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1.66602 10L9.99935 14.1667L18.3327 10"
            stroke="#C1C0C0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

class ProjectsListPopup extends Component {
    constructor(props) {
        super(props);

        this.dropdown = React.createRef();
        this.input = React.createRef();

        this.state = {
            projectsList: null,
            isOpen: false,
            inputValue: '',
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.projectsList === null) {
            const { projectsList } = props;
            return {
                projectsList,
            };
        }
        return null;
    }

    getProjectData = key => {
        const { projectsList, selectedProjectId } = this.props;
        const filteredProjectsList = projectsList.filter(project => project.id === selectedProjectId);
        if (key === 'color') {
            if (filteredProjectsList.length > 0) {
                return filteredProjectsList[0].projectColor.name;
            }
        } else if (key === 'name') {
            if (filteredProjectsList.length > 0) {
                return filteredProjectsList[0].name;
            }
        }
        return filteredProjectsList[0];
    };

    openDropdown = event => {
        const { onChangeVisibility, disabled } = this.props;
        if (disabled) return;
        this.setState(
            {
                isOpen: true,
            },
            () => onChangeVisibility(true)
        );
        document.addEventListener('click', this.closeDropdown);
    };

    closeDropdown = event => {
        if (!event.target.classList.contains('project-list-popup__dropdown-list-input')) {
            const { onChangeVisibility } = this.props;
            document.removeEventListener('click', this.closeDropdown);
            this.setState(
                {
                    isOpen: false,
                },
                () => onChangeVisibility(false)
            );
        }
    };

    onChangeInput = event => {
        const value = event.target.value;
        this.setState({
            inputValue: value.trim().toLowerCase(),
        });
    };

    filterList = initial => {
        const { projectsList } = this.props;
        const { inputValue } = this.state;

        const filteredProjectsList = projectsList.filter(
            project => project.name.toLowerCase().indexOf(inputValue) !== -1
        );
        this.setState({
            projectsList: initial ? projectsList : filteredProjectsList,
        });
    };

    componentDidUpdate(prevProps, prevState) {
        const { isOpen, inputValue } = this.state;
        const { scrollToAction, withFolder } = this.props;

        if (!prevState.isOpen && isOpen) {
            this.input.current.focus();
            if (!withFolder) {
                const height = window.innerHeight || window.document.documentElement.clientHeight;
                const boundingClientRect = this.dropdown.current.getBoundingClientRect();
                const { bottom } = boundingClientRect;
                if (bottom > height) {
                    const diff = bottom - height;
                    scrollToAction(diff);
                }
            }
        }
        if (prevState.isOpen && !isOpen) {
            this.setState({
                inputValue: '',
            });
        }

        if (prevState.inputValue !== inputValue) {
            if (inputValue) {
                this.filterList();
            } else {
                this.filterList(true);
            }
        }
    }

    componentWillUnmount() {
        const { onChangeVisibility } = this.props;
        onChangeVisibility(false);
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        const { vocabulary, onChange, listItem, withFolder, isMobile } = this.props;
        const { v_find } = vocabulary;
        const { isOpen, projectsList, inputValue } = this.state;

        return (
            <div
                className={classNames('project-list-popup', {
                    'project-list-popup--list-item': listItem,
                    'project-list-popup--mobile': isMobile,
                })}
            >
                <div className="project-list-popup__selected-project" onClick={this.openDropdown}>
                    <span className="project-list-popup__circle" style={{ background: this.getProjectData('color') }} />
                    <span className="project-list-popup__project-name">{this.getProjectData('name')}</span>
                    {withFolder && <FolderIcon className="project-list-popup__folder-icon" />}
                </div>
                {isOpen && (
                    <div ref={this.dropdown} className={classNames('project-list-popup__dropdown')}>
                        <div className="project-list-popup__dropdown-list-input">
                            <input
                                ref={this.input}
                                value={inputValue}
                                onChange={this.onChangeInput}
                                type="text"
                                placeholder={`${v_find}...`}
                            />
                        </div>
                        <div className="project-list-popup__dropdown-list">
                            {projectsList.map(project => {
                                const { id, name, projectColor } = project;
                                return (
                                    <div
                                        key={id}
                                        className="project-list-popup__dropdown-list-item"
                                        onClick={event => onChange(id)}
                                    >
                                        <span
                                            className="project-list-popup__dropdown-list-item-circle"
                                            style={{ background: projectColor.name }}
                                        />
                                        <span className="project-list-popup__dropdown-list-item-project-name">
                                            {name}
                                        </span>
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

ProjectsListPopup.defaultProps = {
    onChangeVisibility: () => {},
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    projectsList: state.projectReducer.projectsList,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    scrollToAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsListPopup);
