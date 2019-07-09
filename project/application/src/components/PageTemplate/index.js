import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// dependencies
import classNames from 'classnames';

// actions
import { switchMenu } from '../../actions/ResponsiveActions';
import { switchLanguage } from '../../actions/LanguageActions';

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
        const {
            content: Content,
            switchMenu,
            isShowMenu,
            isMobile,
            vocabulary,
            hideSidebar,
            hideHeader,
            switchLanguage,
        } = this.props;
        const { teamsUpdateTimestamp } = this.state;
        return (
            <div className="wrapper-page-template" style={{ width: width - 1, height: height - 1 }}>
                {/* <button onClick={event => switchLanguage()} style={{ padding: '1rem 0', fontSize: '2rem' }}>
                    switch language
                </button> */}
                {isMobile &&
                    !hideHeader && (
                        <header className="header">
                            <Header />
                        </header>
                    )}
                <div className="wrapper-main-content">
                    {!hideSidebar && (
                        <aside
                            className={classNames('aside', {
                                'aside--hide': !isShowMenu && isMobile,
                                'aside--show': isShowMenu && isMobile,
                            })}
                        >
                            <LeftBar
                                teamsUpdateTimestamp={teamsUpdateTimestamp}
                                isShowMenu={isShowMenu}
                                switchMenu={switchMenu}
                                isMobile={isMobile}
                                vocabulary={vocabulary}
                            />
                        </aside>
                    )}
                    <main className="main">
                        <Content vocabulary={vocabulary} setTeamsUpdateTimestamp={this.setTeamsUpdateTimestamp} />
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
});

const mapDispatchToProps = {
    switchMenu,
    switchLanguage,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PageTemplate)
);
