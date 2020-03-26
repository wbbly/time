import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// dependencies
import classNames from 'classnames';

// actions
import { switchMenu } from '../../actions/ResponsiveActions';
import { showNotificationAction } from '../../actions/NotificationActions';

// components
import LeftBar from '../../components/LeftBar';
import Header from '../../components/Header';
import ModalInfo from '../../components/ModalInfo';

// styles
import './style.scss';

class PageTemplate extends Component {
    teamSwitched = () => {
        const { currentTeam, vocabulary, showNotificationAction } = this.props;
        const { v_switch_team_to_the } = vocabulary;
        showNotificationAction({
            type: 'team-switched',
            text: `${v_switch_team_to_the} ${currentTeam.data.name}`,
        });
    };

    componentDidUpdate(prevProps) {
        const { currentTeam } = this.props;
        if (prevProps.currentTeam.data.name && currentTeam.data.name !== prevProps.currentTeam.data.name) {
            this.teamSwitched();
        }
    }

    render() {
        const {
            content: Content,
            switchMenu,
            isShowMenu,
            isMobile,
            vocabulary,
            hideSidebar,
            hideHeader,
            viewport,
            notificationId,
        } = this.props;
        const { width, height } = viewport;

        return (
            <div className="wrapper-page-template" style={{ width: width - 1, height: height - 1 }}>
                {isMobile &&
                    !hideHeader && (
                        <header className="header">
                            <Header />
                        </header>
                    )}
                {notificationId.length ? <ModalInfo /> : null}
                <div className="wrapper-main-content">
                    {!hideSidebar && (
                        <aside
                            className={classNames('aside', {
                                'aside--hide': !isShowMenu && isMobile ,
                                'aside--show': isShowMenu && isMobile,
                            })}
                        >
                            <LeftBar
                                isShowMenu={isShowMenu}
                                switchMenu={switchMenu}
                                isMobile={isMobile}
                                vocabulary={vocabulary}
                            />
                        </aside>
                    )}
                    <main className="main">
                        <Content isMobile={isMobile} vocabulary={vocabulary} />
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
    vocabulary: state.languageReducer.vocabulary,
    notificationId: state.notificationReducer.notificationId,
    currentTeam: state.teamReducer.currentTeam,
});

const mapDispatchToProps = {
    switchMenu,
    showNotificationAction,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PageTemplate)
);
