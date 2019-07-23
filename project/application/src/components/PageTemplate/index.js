import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// dependencies
import classNames from 'classnames';

// actions
import { switchMenu } from '../../actions/ResponsiveActions';

// components
import LeftBar from '../../components/LeftBar';
import Header from '../../components/Header';
import ModalInfo from '../../components/ModalInfo';

// styles
import './style.scss';

class PageTemplate extends Component {
    state = {
        teamsUpdateTimestamp: null,
        showModal: false,
        modalInfoContent: {
            type: 'lost-connection',
        },
    };
    componentDidMount() {
        window.addEventListener('online', this.connectionRestore);
        window.addEventListener('offline', this.connectionLost);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.connectionRestore);
        window.removeEventListener('offline', this.connectionLost);
    }

    setTeamsUpdateTimestamp = teamsUpdateTimestamp =>
        this.setState({
            teamsUpdateTimestamp,
        });
    showModalInfo = (text, type) => {
        this.setState({ showModal: true, modalInfoContent: { text, type } });
    };
    hideModalInfo = () => {
        this.setState({
            showModal: false,
            modalInfoContent: {
                type: 'lost-connection',
            },
        });
    };
    connectionRestore = e => {
        const { v_connection_restored } = this.props.vocabulary;
        this.showModalInfo(v_connection_restored, 'connection-restored');
    };
    connectionLost = e => {
        const { v_connection_problem } = this.props.vocabulary;
        this.showModalInfo(v_connection_problem, 'lost-connection');
    };
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
        } = this.props;
        const { width, height } = viewport;
        const { teamsUpdateTimestamp } = this.state;

        return (
            <div className="wrapper-page-template" style={{ width: width - 1, height: height - 1 }}>
                {isMobile &&
                    !hideHeader && (
                        <header className="header">
                            <Header />
                        </header>
                    )}
                <ModalInfo
                    modalInfoText={this.state.modalInfoContent.text}
                    modalInfoType={this.state.modalInfoContent.type}
                    modalInfoVisible={this.state.showModal}
                    onClick={this.hideModalInfo}
                />
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
                        <Content
                            isMobile={isMobile}
                            vocabulary={vocabulary}
                            setTeamsUpdateTimestamp={this.setTeamsUpdateTimestamp}
                        />
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
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PageTemplate)
);
