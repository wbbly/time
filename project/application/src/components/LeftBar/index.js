import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import classNames from 'classnames';

// Services
import { checkIsAdminByRole } from '../../services/authentication';

// Components
import TeamSwitcher from '../TeamSwitcher';
import UserMenu from '../UserMenu';
import CustomScrollbar from '../../components/CustomScrollbar';

// Styles
import './style.scss';
import { switchMenu } from '../../actions/ResponsiveActions';

class LeftBar extends Component {
    renderTimer = () => {
        const { history, timerTick } = this.props;
        if (history.location.pathname !== '/timer') {
            return timerTick ? timerTick : '';
        }
    };

    render() {
        const { switchMenu, isMobile, vocabulary, currentTeam, isOwner, user } = this.props;
        const { v_help, v_timer, v_reports, v_projects, v_team, v_clients, v_invoices } = vocabulary;

        let userId = '';
        if (user) {
            userId = user.id;
        }

        return (
            <div className={classNames('wrapper', { 'wrapper--mobile': isMobile })}>
                {/* </CustomScrollbar> */}
                {!isMobile && (
                    <Link onClick={switchMenu} to="/timer">
                        <i className="logo_small" />
                    </Link>
                )}

                <div className="navigation_links_container">
                    <NavLink
                        activeClassName="active-link"
                        onClick={switchMenu}
                        to="/timer"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="navigation_links">
                            <i className="timer" />
                            <div className="links_text">{v_timer}</div>
                            <div className="timer_task">{this.renderTimer()}</div>
                        </div>
                    </NavLink>
                    <NavLink
                        activeClassName="active-link"
                        isActive={() => {
                            const { match } = this.props;
                            return match.path.indexOf('/reports') >= 0;
                        }}
                        onClick={switchMenu}
                        to="/reports/summary"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="navigation_links">
                            <i className="reports" />
                            <div className="links_text">{v_reports}</div>
                        </div>
                    </NavLink>
                    <NavLink
                        activeClassName="active-link"
                        onClick={switchMenu}
                        to="/projects"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="navigation_links">
                            <i className="projects" />
                            <div className="links_text">{v_projects}</div>
                        </div>
                    </NavLink>
                    {checkIsAdminByRole(currentTeam.data.role) && (
                        <NavLink
                            activeClassName="active-link"
                            onClick={switchMenu}
                            to="/clients"
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="navigation_links">
                                <i className="clients" />
                                <div className="links_text">{v_clients}</div>
                            </div>
                        </NavLink>
                    )}
                    {isOwner == userId && (
                        <NavLink
                            activeClassName="active-link"
                            onClick={switchMenu}
                            to="/invoices"
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="navigation_links">
                                <i className="invoices" />
                                <div className="links_text">{v_invoices}</div>
                            </div>
                        </NavLink>
                    )}
                </div>
                <div className="wrapper-position-add-team">
                    <TeamSwitcher isMobile={isMobile} />
                    <NavLink
                        activeClassName="active-link"
                        onClick={switchMenu}
                        to="/team"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className={classNames('navigation_links active_team')}>
                            <span>{currentTeam.data.name + ' '}</span>
                            <div className="active-point" />
                        </div>
                    </NavLink>
                </div>
                <a className="navigation_links" target="_blank" href="https://telegra.ph/Wobbly-help-07-09">
                    <i className="help" />
                    <div className="links_text">{v_help}</div>
                </a>
                <UserMenu switchMenu={switchMenu} />
                {/* </CustomScrollbar> */}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentTimer: state.mainPageReducer.currentTimer,
    durationTimeFormat: state.userReducer.durationTimeFormat,
    currentTeam: state.teamReducer.currentTeam,
    timerTick: state.mainPageReducer.timerTick,
    isOwner: state.teamReducer.currentTeam.data.owner_id,
    user: state.userReducer.user,
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
