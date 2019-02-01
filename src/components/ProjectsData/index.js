import React, {Component} from 'react';
import './style.css';
import PropTypes from 'prop-types'

export default class ProjectData extends Component {
    render() {
        let tableInfo = this.props.tableInfo;
        const tableHeader = ['Project name', 'Status', 'Team'];
        const tableInfoElements = tableInfo.map(item =>
            <tr key={item.id}>
                <td>{item.projectName}</td>
                <td>{item.projectStatus}</td>
                <td>{item.team}</td>
            </tr>
        );
        const tableHeaderElements = tableHeader.map(item => <th>{item}</th>)
        return (
            <div className="project_data_wrapper">
                <table>
                    <thead>
                    <tr>
                        {tableHeaderElements}
                    </tr>
                    </thead>
                    <tbody>
                    {tableInfoElements}
                    </tbody>
                </table>
            </div>
        )
    }
}

ProjectData.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};
