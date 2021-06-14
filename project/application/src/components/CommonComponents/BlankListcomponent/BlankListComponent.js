import React from 'react';

// dependencies

// Styles
import './blankList.scss';
import animation_cat from '../../../images/animation_cat.gif';

export const BlankListComponent = ({ text, subtext, position }) => {
    return (
        <div className="cat-wrapper" style={position}>
            <img alt="animation-cat" src={animation_cat} className={'animation-cat'} />
            <p className={'animation-cat-comment'}>
                {text}
                <br />
                {subtext}
            </p>
        </div>
    );
};
