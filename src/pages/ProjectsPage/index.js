import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux'
import LeftBar from '../../components/LeftBar';
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal';
import toggleModalAddProject from '../../actions/projectsActions';
import { client } from '../../requestSettings';
import { getProjects } from '../../queries';

class ProjectsPage extends Component {

    toggleModal(item) {
        item('TOGGLE_MODAL', true);
    }
    state = {
        etalonArr: []
    };

    render() {
        const {tableData, addNewProjectModalToggle, toggleModalAddProject} = this.props;

        return (
            <div className="wrapper_projects_page">
                {addNewProjectModalToggle &&
                <CreateProjectModal tableInfo={tableData} toggleModal={toggleModalAddProject}/>}
                <LeftBar/>
                <div className="data_container_projects_page">
                    <div className="projects_page_header">
                        <div className="projects_page_title">
                            Projects
                        </div>
                        <button className="create_project_button"
                                onClick={e => toggleModalAddProject('TOGGLE_MODAL', {toggle: true})}>
                            Create new project
                        </button>
                    </div>
                    <div className="project_page_filters">
                        <ProjectSearchBar tableInfo={this.props.tableData} etalonArr={this.state.etalonArr} toggleModal={toggleModalAddProject}/>
                    </div>
                    <div className="project_data_wrapper">
                        <ProjectData tableInfo={tableData}/>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        client.request(getProjects).then(data=>{
            this.setState({etalonArr: data.project});
            this.props.toggleModalAddProject('CREATE_PROJECT', {toggle: false, tableData: data.project})
        })
    }
}

const mapStateToProps = store => {
    return {
        tableData: store.projectReducer.tableData,
        addNewProjectModalToggle: store.projectReducer.addNewProjectModalToggle,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toggleModalAddProject: (actionType, toggle) => dispatch(toggleModalAddProject(actionType, toggle))[1]
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsPage)
