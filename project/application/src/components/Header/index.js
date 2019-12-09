import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// dependencies
import classNames from 'classnames';

// actions
import { switchMenu, setSwipedTaskAction } from '../../actions/ResponsiveActions';

// styles
import './style.scss';

class Header extends Component {
    swithMenuHandle = event => {
        const { switchMenu, setSwipedTaskAction } = this.props;
        setSwipedTaskAction(null);
        switchMenu();
    };

    render() {
        const { isShowMenu } = this.props;

        return (
            <div className="main-header">
                <Link to="/timer">
                    <i className="main-header__small-logo" />
                </Link>
                <button onClick={this.swithMenuHandle} className="main-header__show-menu-button">
                    <span
                        className={classNames('main-header__show-menu-button-icon', {
                            'icon-close': isShowMenu,
                            'icon-menu': !isShowMenu,
                        })}
                    />
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    viewport: state.responsiveReducer.viewport,
    isShowMenu: state.responsiveReducer.isShowMenu,
});

const mapDispatchToProps = {
    switchMenu,
    setSwipedTaskAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
