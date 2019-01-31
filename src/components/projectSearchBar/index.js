import React, {Component} from 'react';
import './style.css';
import Select from '../select'

class ProjectSearchBar extends Component {
  render() {
    return (
      <div className="wrapper_project_search_bar">
        <div className="project_search_bar_select_wrapper">
          <Select />
        </div>
        <div className="project_search_bar_select_wrapper">
          <Select />
        </div>
        <div className="project_search_bar_search_field_container">
          <i className="magnifer"></i>
          <input type="text" className="project_search_bar_search_field"/>
        </div>
        <div className="project_search_bar_button_container">
          <button className="project_search_bar_button">Apply</button>
        </div>
      </div>
    )
  }
}

export default ProjectSearchBar;
