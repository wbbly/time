import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default class ProjectData extends Component {
    deleteFromArr(item, arr) {
        console.log(arr, 'arr0');
        arr.splice(arr.indexOf(item), 1);
        console.log(arr, 'arr1');
    }

    render() {
        let tableInfo = this.props.tableInfo;
        const tableHeader = [
            {
                key: 1,
                value: 'Project name',
            },
            {
                key: 2,
                value: 'Status',
            },
            {
                key: 3,
                value: 'Team',
            },
        ];
        const tableInfoElements = tableInfo.map(item => (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.projectStatus}</td>
                <td>
                    {item.team} <i className="delete" onClick={e => this.deleteFromArr(item, this.props.tableInfo)} />
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
