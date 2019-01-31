import React, {Component} from 'react';
import './style.css';
import CreateProjectModal from '../../components/CreateProjectModal'

class ProjectData extends Component {
    render() {
        const tableHeader = ['Project name', 'Status', 'Team'];
        const tableInfo = [
            {
                projectName: 'test',
                projectStatus: '21',
                team: 'Hr',
            },
            {
                projectName: 'test',
                projectStatus: '21',
                team: 'Hr',
            },
        ]
        const tableInfoElements = tableInfo.map(item =>
            <tr>
                <td>{item.projectName}</td>
                <td>{item.projectStatus}</td>
                <td>{item.team}</td>
            </tr>
        )
        const tableHeaderElements = tableHeader.map(item => <th>{item}</th>)
        return (
            <div className="project_data_wrapper">
                {/*<CreateProjectModal />*/}
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

export default ProjectData;
