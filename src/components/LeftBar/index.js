import React from 'react';
import './index.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

const LeftBar = () => {
  return (
    <div className="wrapper">
      <i className="logo_small"></i>
      <div className="navigation_links_container">
        <Link to="/main-page">
          <div className="navigation_links">
            <i className="timer"></i>
            <div className="links_text">timer</div>
          </div>
        </Link>
        <Link to="/reports">
          <div className="navigation_links">
            <i className="reports"></i>
            <div className="links_text">reports</div>
          </div>
        </Link>
        <Link to="/projects">
          <div className="navigation_links">
            <i className="projects"></i>
            <div className="links_text">projects</div>
          </div>
        </Link>
        <Link to="/team">
          <div className="navigation_links">
            <i className="team"></i>
            <div className="links_text">team</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default LeftBar;
