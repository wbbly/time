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

    handleScrollTo = top => {
        const { scrollbars } = this.refs;
        scrollbars.scrollTop(top);
    };

    componentDidUpdate(prevProps, prevState) {
        const { scrollTo, scrollToAction } = this.props;
        const { scrollbars } = this.refs;

        if (scrollTo && prevProps.scrollTo !== scrollTo) {
            const top = scrollbars.getScrollTop();
            scrollbars.scrollTop(top + scrollTo + 20);
            scrollToAction(null);
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
