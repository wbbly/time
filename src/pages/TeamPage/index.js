import React, {Component} from 'react';
import './index.css';
import LeftBar from '../../components/LeftBar';

class TeamPage extends Component {
  programersArr = [
    {
      id: 1,
      name: 'Alexey',
      email: 'alexeysergeev@gmail.com',
      access: 'Admin'
    },
    {
      id: 2,
      name: 'Alexey',
      email: 'alexeysergeev@gmail.com',
      access: 'Admin'
    },
    {
      id: 3,
      name: 'Alexey',
      email: 'alexeysergeev@gmail.com',
      access: 'Admin'
    }
  ];
    headerItems = [
        'Name',
        'E-mail',
        'Access',
    ];

  render() {
    const headerItemsElements = this.headerItems.map( (element)=>
        <th key={element}>{element}</th>
    )
    const items = this.programersArr.map((element) =>
      <tr key={element.id}>
        <td>{element.name}</td>
        <td>{element.email}</td>
        <td>
          <div className="access_container">
            {element.access}
          </div>
        </td>
      </tr>
    )

    return (
      <div className="wrapper_team_page">
        <LeftBar/>
        <div className="data_container_team_page">
          <div className="team_page_header">
            <div className="page_name">
              Team
            </div>
            <div className="invite_container">
              <input type="text"/>
              <button>Invite</button>
            </div>
          </div>
          <div className="team_page_data">
            <table>
              <thead>
              {headerItemsElements}
              </thead>
              <tbody>
              {items}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamPage;
