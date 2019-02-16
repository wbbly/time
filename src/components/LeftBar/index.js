import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const LeftBar = () => {
    return (
        <div className="wrapper">
            <i className="logo_small" />
            <div className="navigation_links_container">
                <Link to="/main-page" style={{ textDecoration: 'none' }}>
                    <div className="navigation_links">
                        <i className="timer" />
                        <div className="links_text">timer</div>
                    </div>
                </Link>
                <Link to="/reports" style={{ textDecoration: 'none' }}>
                    <div className="navigation_links">
                        <i className="reports" />
                        <div className="links_text">reports</div>
                    </div>
                </Link>
                <Link to="/projects" style={{ textDecoration: 'none' }}>
                    <div className="navigation_links">
                        <i className="projects" />
                        <div className="links_text">projects</div>
                    </div>
                </Link>
                <Link to="/team" style={{ textDecoration: 'none' }}>
                    <div className="navigation_links">
                        <i className="team" />
                        <div className="links_text">team</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};
export default LeftBar;
