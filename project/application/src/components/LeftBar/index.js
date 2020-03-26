import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';

import classNames from 'classnames';

// Services
import { checkIsAdminByRole } from '../../services/authentication';

// Components
import TeamSwitcher from '../TeamSwitcher';
import UserMenu from '../UserMenu';

// Styles
import './style.scss';
import { switchMenu } from '../../actions/ResponsiveActions';

class LeftBar extends Component {
    state={
        widthMenu:188
    };
    renderTimer = () => {
        const { history, timerTick } = this.props;
        if (history.location.pathname !== '/timer') {
            return timerTick ? timerTick : '';
        }
    };

    closeMenu = () => {
        const { widthMenu } = this.state;
        const newWidthMenu = widthMenu - 35;
        if (widthMenu > 48) {
            this.setState({ widthMenu: newWidthMenu });
            requestAnimationFrame(this.closeMenu);
        }
    };

    openMenu = () => {
        const { widthMenu } = this.state;
        const newWidthMenu = widthMenu + 35;
        if (widthMenu < 188) {
            this.setState({ widthMenu: newWidthMenu });
            requestAnimationFrame(this.openMenu);
        }
    };

    swithMenuHandle = () => {
        const { switchMenu , isShowMenu } = this.props;
        if(!isShowMenu) {
            this.closeMenu();
        }else {
            this.openMenu()
        }

        switchMenu();
    };

    swithMenuHandleMob = () => {
        const { switchMenu, isMobile } = this.props;
        if(isMobile) {
            switchMenu();
        }
    };

    render() {
        const { switchMenu, isMobile, vocabulary, currentTeam, isShowMenu } = this.props;
        const { v_timer, v_reports, v_projects, v_team, v_clients } = vocabulary;
        const { widthMenu } = this.state;
        return (
            <div style={{width:!isMobile && widthMenu}} className={classNames('wrapper',
                {
                    'wrapper--mobile': isMobile,
                    'wrapper_hide':!isShowMenu && !isMobile
                })}>
                {!isMobile && (
                    <div className="header-nav">
                        <button onClick={this.swithMenuHandle} className="show-menu-button">
                            <span className={classNames('show-menu-button-icon', 'icon-menu')} />
                        </button>
                        <Link  to="/timer">
                            <i style={{opacity:!isShowMenu?'1':'0'}} className="logo_small" />
                        </Link>
                    </div>
                )}

                <div className="navigation_links_container">
                    <NavLink
                        activeClassName="active-link"
                        onClick={this.swithMenuHandleMob}
                        to="/timer"
                        style={{ textDecoration: 'none' }}
                    >
                        <div title="Timer" className={classNames('navigation_links',
                            {
                                'navigation_links-hide_menu': isShowMenu && !isMobile && widthMenu < 100
                            })} >
                            <i className="timer" />
                            <div className="links_text" >{v_timer}</div>
                            <div className="timer_task" >{this.renderTimer()}</div>
                        </div>
                    </NavLink>
                    <NavLink
                        activeClassName="active-link"
                        isActive={() => {
                            const { match } = this.props;
                            return match.path.indexOf('/reports') >= 0;
                        }}
                        onClick={this.swithMenuHandleMob}
                        to="/reports/summary"
                        style={{ textDecoration: 'none' }}
                    >
                        <div title="Reports" className={classNames('navigation_links',
                            {
                                'navigation_links-hide_menu': isShowMenu && !isMobile && widthMenu < 100
                            })}>
                            <i className="reports" />
                            <div className="links_text">{v_reports}</div>
                        </div>
                    </NavLink>
                    <NavLink
                        activeClassName="active-link"
                        onClick={this.swithMenuHandleMob}
                        to="/projects"
                        style={{ textDecoration: 'none' }}
                    >
                        <div title="Projects" className={classNames('navigation_links',
                            {
                                'navigation_links-hide_menu': isShowMenu && !isMobile && widthMenu < 100
                            })}>
                            <i className="projects" />
                            <div className="links_text">{v_projects}</div>
                        </div>
                    </NavLink>
                    {checkIsAdminByRole(currentTeam.data.role) && (
                        <NavLink
                            activeClassName="active-link"
                            onClick={this.swithMenuHandleMob}
                            to="/clients"
                            style={{ textDecoration: 'none' }}
                        >
                            <div title="Clients" className={classNames('navigation_links',
                                {
                                    'navigation_links-hide_menu': isShowMenu && !isMobile && widthMenu < 100
                                })}>
                                <i className="clients" />
                                <div className="links_text">{v_clients}</div>
                            </div>
                        </NavLink>
                    )}
                    <div className="wrapper-position-add-team">
                        <NavLink
                            activeClassName="active-link"
                            onClick={this.swithMenuHandleMob}
                            to="/team"
                            style={{ textDecoration: 'none' }}
                        >
                            <div title="Team" className={classNames('navigation_links',
                                {
                                    'navigation_links-hide_menu': isShowMenu && !isMobile && widthMenu < 100
                                })}>
                                <i className="team" />
                                <div className="links_text">{v_team}</div>
                            </div>
                        </NavLink>
                        <TeamSwitcher isMobile={isMobile} isShowMenu={isShowMenu} />
                    </div>
                </div>
                <UserMenu switchMenu={switchMenu} isShowMenu={isShowMenu} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentTimer: state.mainPageReducer.currentTimer,
    isShowMenu: state.responsiveReducer.isShowMenu,
    durationTimeFormat: state.userReducer.durationTimeFormat,
    currentTeam: state.teamReducer.currentTeam,
    timerTick: state.mainPageReducer.timerTick,
});

const mapDispatchToProps = {
    switchMenu,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LeftBar)
);
