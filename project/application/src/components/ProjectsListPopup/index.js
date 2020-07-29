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
        width="24"
        height="20"
        viewBox="0 0 24 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9.6 0.399902H2.4C1.08 0.399902 0 1.4799 0 2.7999V17.1999C0 18.5199 1.08 19.5999 2.4 19.5999H21.6C22.92 19.5999 24 18.5199 24 17.1999V5.1999C24 3.8799 22.92 2.7999 21.6 2.7999H12L9.6 0.399902Z"
            fill="#C1C0C0"
        />
    </svg>
);

class ProjectsListPopup extends Component {
    state = {
        projectsList: null,
        isOpen: false,
        inputValue: '',
    };

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
        const { dropdown } = this.refs;

        if (!prevState.isOpen && isOpen) {
            this.input.current.focus();
            if (!withFolder) {
                const height = window.innerHeight || window.document.documentElement.clientHeight;
                const boundingClientRect = dropdown.getBoundingClientRect();
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
                    <div ref="dropdown" className={classNames('project-list-popup__dropdown')}>
                        <input
                            className="project-list-popup__dropdown-list-input"
                            ref={(this.input = React.createRef())}
                            value={inputValue}
                            onChange={this.onChangeInput}
                            type="text"
                            placeholder={`${v_find}...`}
                        />
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
