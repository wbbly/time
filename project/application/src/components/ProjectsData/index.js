import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';
import { client } from '../../requestSettings';
import { returnMutationLinkDeleteProject } from '../../queries';
import { getDateInString } from '../../pages/MainPage/timeInSecondsFunction';

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
        ];
        const tableInfoElements = this.props.tableInfo.map((item, index) => (
            <tr key={'table-header_' + index}>
                <td>{item.name}</td>
                <td>{getDateInString(item.totalTime)}</td>
            </tr>
        ));
        const tableHeaderElements = tableHeader.map((item, index) => <th key={'table-info_' + index}>{item.value}</th>);

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
