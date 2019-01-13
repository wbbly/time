import React, { Component } from 'react';
import './index.css';

class MainPageHistory extends Component {
  arrElements = [
    {
      name: 'dcdsjcns',
      timeFrom: '12:11:10',
      timeTo: '12:11:10',
      timePassed: '08:10:10',
      project: 'any'
    },
  ]

  render() {
    const items = this.arrElements.map((element) =>
      <li key={element.name}>
        <div className="name_container">
          <div className="name">
            {element.name}
          </div>
          <div className="project_name">
            {element.project}
          </div>
        </div>
        <div className="time_container_history">
          <div className="time_now">
            <div>{element.timeFrom}</div>
            -
            <div>{element.timeTo}</div>
          </div>
          <div className="timePassed">
            {element.timePassed}
          </div>
          <i className="small_play"></i>
          <i className="cancel"></i>
        </div>
      </li>)
    return (
      <ul>
        {items}
      </ul>
    )
  }

}

export default MainPageHistory;
