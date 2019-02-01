import React, { Component } from 'react';
import './index.css';
import LeftBar from '../../components/LeftBar';

class ReportsPage extends Component {
    render() {
        return (
            <div className="wrapper_reports_page">
                <LeftBar/>
                <div className="data_container_reports_page">
                    <div className="header">
                        <div className="header_name">
                            Summary report
                        </div>
                        <div className="selects_container">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReportsPage;
