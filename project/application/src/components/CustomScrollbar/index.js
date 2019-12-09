import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';
import { incPaginationAction, getTimeEntriesListPaginationAction } from '../../actions/MainPageAction';

import { Scrollbars } from 'react-custom-scrollbars';

class CustomScrollbar extends Component {
    constructor(props, ...rest) {
        super(props, ...rest);
    }

    animateScroll = () => {
        const { scrollTo, scrollToAction } = this.props;
        const { scrollbars } = this.refs;

        const top = scrollbars.getScrollTop();

        let startTime = performance.now();
        const animate = timestamp => {
            const runtime = timestamp - startTime;
            const progress = runtime / 200;
            const procent = progress >= 0 ? Math.min(progress, 1) : 0;
            scrollbars.scrollTop(procent * (scrollTo + 10) + top);
            if (procent < 1) {
                requestAnimationFrame(animate);
            } else {
                scrollToAction(null);
            }
        };
        requestAnimationFrame(animate);
    };

    handleScrollFrame = values => {
        const {
            incPaginationAction,
            isFetchingTimeEntriesList,
            getTimeEntriesListPaginationAction,
            pagination,
        } = this.props;
        const { top } = values;
        if (top > 0.7) {
            if (!isFetchingTimeEntriesList && !pagination.disabled) {
                incPaginationAction();
                getTimeEntriesListPaginationAction();
            }
        }
    };

    componentDidUpdate(prevProps, prevState) {
        const { scrollTo } = this.props;

        if (scrollTo && prevProps.scrollTo !== scrollTo) {
            this.animateScroll();
        }
    }

    render() {
        const { children } = this.props;
        return <Scrollbars ref="scrollbars" children={children} onScrollFrame={this.handleScrollFrame} />;
    }
}

const mapStateToProps = state => ({
    scrollTo: state.responsiveReducer.scrollTo,
    isFetchingTimeEntriesList: state.mainPageReducer.isFetchingTimeEntriesList,
    pagination: state.mainPageReducer.pagination,
});

const mapDispatchToProps = {
    scrollToAction,
    incPaginationAction,
    getTimeEntriesListPaginationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomScrollbar);
