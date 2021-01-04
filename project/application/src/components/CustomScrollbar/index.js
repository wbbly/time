import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';
import { incPaginationAction, getTimeEntriesListPaginationAction } from '../../actions/MainPageAction';

import { Scrollbars } from 'react-custom-scrollbars';

import './style.css';

class CustomScrollbar extends Component {
    constructor(props, ...rest) {
        super(props, ...rest);

        this.scrollbars = React.createRef();
    }

    animateScroll = () => {
        const { scrollTo, scrollToAction } = this.props;

        const top = this.scrollbars.current.getScrollTop();

        let startTime = performance.now();
        const animate = timestamp => {
            const runtime = timestamp - startTime;
            const progress = runtime / 300;
            const procent = progress >= 0 ? Math.min(progress, 1) : 0;
            this.scrollbars.current.scrollTop(procent * (scrollTo + 10) + top);
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
            disableTimeEntriesFetch,
        } = this.props;
        const { top } = values;
        if (disableTimeEntriesFetch) return;
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
        return (
            <Scrollbars
                className="scroll-bar"
                ref={this.scrollbars}
                children={children}
                onScrollFrame={this.handleScrollFrame}
            />
        );
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
