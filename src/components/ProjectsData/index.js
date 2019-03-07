import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import { client } from '../../requestSettings';
import { returnMutationLinkDeleteProject } from '../../queries';

export default class ProjectData extends Component {
    deleteFromArr(item, arr) {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id !== item.id) {
                newArr.push(arr[i]);
            }
        }
        this.props.projectsPageAction('CHANGE_ARR', { tableData: newArr });
        client.request(returnMutationLinkDeleteProject(item)).then(data => {});
    }

    render() {
        const tableHeader = [
            {
                key: 1,
                value: 'Project name',
            },
            {
                key: 2,
                value: 'Time',
            },
            {
                key: 3,
                value: 'Team',
            },
        ];
        const tableInfoElements = this.props.tableInfo.map(item => (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.projectStatus}</td>
                <td>
                    {item.team}
                    {this.props.canAddToTeam(this.props.activeEmail) && (
                        <i className="delete" onClick={e => this.deleteFromArr(item, this.props.tableInfo)} />
                    )}
                </td>
            </tr>
        ));
        const tableHeaderElements = tableHeader.map(item => <th key={item.key}>{item.value}</th>);
        return (
            <div className="project_data_wrapper">
                <table>
                    <thead>
                        <tr>{tableHeaderElements}</tr>
                    </thead>
                    <tbody>{tableInfoElements}</tbody>
                </table>
            </div>
        );
    }
}

ProjectData.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};
