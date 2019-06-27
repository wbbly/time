import React, { Component } from 'react';
import { connect } from 'react-redux';

// dependencies
import classNames from 'classnames';

// actions
import { switchMenu } from '../../actions/ResponsiveActions';

// components
import LeftBar from '../../components/LeftBar';
import Header from '../../components/Header';

// styles
import './style.scss';

class PageTemplate extends Component {
    state = {
        teamsUpdateTimestamp: null,
    };

    setTeamsUpdateTimestamp = teamsUpdateTimestamp =>
        this.setState({
            teamsUpdateTimestamp,
        });

    render() {
        const { width, height } = this.props.viewport;
        const { content: Content, switchMenu, isShowMenu, isMobile } = this.props;
        const { teamsUpdateTimestamp } = this.state;
        return (
            <div className="wrapper-page-template" style={{ width: width - 1, height: height - 1 }}>
                {isMobile && <Header />}
                <div className="wrapper-main-content">
                    <aside
                        className={classNames('aside', {
                            'aside--hide': !isShowMenu && width < 1024,
                            'aside--show': isShowMenu && width < 1024,
                        })}
                    >
                        <LeftBar
                            teamsUpdateTimestamp={teamsUpdateTimestamp}
                            isShowMenu={isShowMenu}
                            switchMenu={switchMenu}
                            isMobile={isMobile}
                        />
                    </aside>
                    <main className="main">
                        <Content setTeamsUpdateTimestamp={this.setTeamsUpdateTimestamp} />
                    </main>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    viewport: state.responsiveReducer.viewport,
    isShowMenu: state.responsiveReducer.isShowMenu,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    switchMenu,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PageTemplate);
