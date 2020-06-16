import React  from 'react';
// Styles
import './blankList.scss'
import animation_cat from '../../../images/animation_cat.gif';
import classNames from 'classnames';

export const BlankListComponent = (text, subtext, smaller) => {
    return (
        <div className="cat-wrapper">
            <img alt="animation-cat" src={animation_cat} className={classNames("animation-cat", {
                        'smaller': smaller,
                    })} />
            <p className={"animation-cat-comment"}>{text}<br/>{subtext}</p>
        </div>
    )   
}