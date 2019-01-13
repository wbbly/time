import React, {Component} from 'react';
import './style.css'

class Select extends Component {

  state = {
    listOpen: false,
    selectedValue: 'Test',
    list: [1, 2, 3, 4, 5],
  }

  render() {
    const listElements = this.state.list.map((item) =>
      <li onClick={e => this.setItem(item)} key={item}>
        <span>{item}</span>
      </li>
    )
    return (
      <div className="select_wrapper">
        {!this.state.listOpen && <input
          type="text"
          value={this.state.selectedValue}
          onClick={this.openCloseList}
          className="selected_item" readOnly={true}/>
        }
        <i className="icon"></i>
        {this.state.listOpen && <ul> {listElements} </ul>}
      </div>
    )
  }

  componentDidMount() {
    this.setState({list: [5, 6, 7, 8, 9]})
  }

  openCloseList = () => {
    this.setState(
      {listOpen: !this.state.listOpen}
    )
  }

  setItem = (item) => {
    this.setState({selectedValue: item});
    this.openCloseList();
  }
}

export default Select
