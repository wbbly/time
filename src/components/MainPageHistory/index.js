import React, {Component} from 'react';
import './index.css';

class MainPageHistory extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // this.arrElements.push(this.props.items);
        return (
            <div className="ul">
                <div className="li" key={this.props.items.name}>
                    <div className="name_container">
                        <div className="name">
                            {this.props.items.name}
                        </div>
                        <div className="project_name">
                            {this.props.items.project}
                        </div>
                    </div>
                    <div className="time_container_history">
                        <div className="time_now">
                            <div>{this.props.items.timeFrom}</div>
                            -
                            <div>{this.props.items.timeTo}</div>
                        </div>
                        <div className="timePassed">
                            {this.props.items.timePassed}
                        </div>
                        <i className="small_play"></i>
                        <i className="cancel"></i>
                    </div>
                </div>
            </div>
        )
    }

}

export default MainPageHistory;
