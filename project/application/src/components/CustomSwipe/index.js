import React from 'react';
import { connect } from 'react-redux';

import Swipe from 'react-easy-swipe';

const CustomSwipe = ({ isMobile, children, className, onSwipeMove }) =>
    isMobile ? (
        <Swipe className={className} onSwipeMove={onSwipeMove}>
            {children}
        </Swipe>
    ) : (
        children
    );

const mapStateToProps = state => ({
    isMobile: state.responsiveReducer.isMobile,
});

export default connect(mapStateToProps)(CustomSwipe);
