import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import LeftBar from '../../components/LeftBar';

class TeamPage extends Component {
    headerItems = ['Name', 'E-mail', 'Access'];

    render() {
        let programersArr = this.props.programersArr;
        const headerItemsElements = this.headerItems.map(element => <th key={element}>{element}</th>);
        const items = programersArr.map(element => (
            <tr key={element.id}>
                <td>{element.name}</td>
                <td>{element.email}</td>
                <td>
                    <div className="access_container">{element.access}</div>
                </td>
            </tr>
        ));

        return (
            <div className="wrapper_team_page">
                <LeftBar />
                <div className="data_container_team_page">
                    <div className="team_page_header">
                        <div className="page_name">Team</div>
                        <div className="invite_container">
                            <input type="text" />
                            <button>Invite</button>
                        </div>
                    </div>
                    <div className="team_page_data">
                        <table>
                            <thead>
                                <tr>{headerItemsElements}</tr>
                            </thead>
                            <tbody>{items}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {}
}

const mapStateToProps = store => {
    return {
        programersArr: store.teamPageReducer.programersArr,
    };
};

export default connect(mapStateToProps)(TeamPage);
