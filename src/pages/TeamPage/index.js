import React, {Component} from 'react';
import './index.css';
// import LeftBar from '../../components/LeftBar/LeftBar';

class TeamPage extends Component {
  programersArr = [
    {
      name: 'Alexey',
      email: 'alexeysergeev@gmail.com',
      access: 'Admin'
    },
    {
      name: 'Alexey',
      email: 'alexeysergeev@gmail.com',
      access: 'Admin'
    },
    {
      name: 'Alexey',
      email: 'alexeysergeev@gmail.com',
      access: 'Admin'
    }
  ]

  render() {
    // let items = this.programersArr.map((item) => {
    //   <td>1q</td>
    //   console.log(item);
    // })

    const items = this.programersArr.map((element) =>
      <tr>
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
        {/*<LeftBar/>*/}
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
              <th>
                Name
              </th>
              <th>
                E-mail
              </th>
              <th>
                Access
              </th>
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
