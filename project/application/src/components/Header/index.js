import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// dependencies
import classNames from 'classnames';

// actions
import { switchMenu } from '../../actions/ResponsiveActions';

// styles
import './style.scss';

class Header extends Component {
    render() {
        const { switchMenu, isShowMenu } = this.props;
        return (
            <header className="header">
                <div className="main-header">
                    <Link to="/timer">
                        <i className="main-header__small-logo" />
                    </Link>
                    <button onClick={switchMenu} className="main-header__show-menu-button">
                        <span
                            className={classNames('main-header__show-menu-button-icon', {
                                'icon-close': isShowMenu,
                                'icon-menu': !isShowMenu,
                            })}
                        />
                    </button>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    viewport: state.responsiveReducer.viewport,
    isShowMenu: state.responsiveReducer.isShowMenu,
});

const mapDispatchToProps = {
    switchMenu,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
