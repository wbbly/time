import React, { Component } from 'react';
import './index.css';
// import LeftBar from '../../components/LeftBar/LeftBar';
// import MainPageHistory from '../../components/MainPageHistory/MainPageHistory';

class MainPage extends Component {
  state = {
    classToggle: true
  };
  time = '00:00:00';

  changeClass = () => {
    this.setState(state => ({
      classToggle: !state.classToggle
    }));
  };

  render() {
    const { classToggle } = this.state;
    const buttonState = classToggle ? 'play' : 'stop';
    const buttonClassName = ['control_task_time_icons', buttonState].join(' ');
    let arr = [1,2,3,4,5]
    // let items = arr.map((item)=> <MainPageHistory key={item} />);

    return (
      <div className="wrapper_main_page">
        {/*<LeftBar />*/}
        <div className="data_container">
          <div className="add_task_container">
            <input
              type="text"
              className="add_task"
              placeholder="Add your task name"
            />
            <div className="time_container">
              {this.time}
            </div>
            <i className="folder"></i>
            <i onClick={this.changeClass} className={buttonClassName} />
          </div>
          {/*{items}*/}
        </div>
      </div>
    );
  }
}
export default MainPage;
