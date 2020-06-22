import React from 'react';

// Styles
import './style.scss';

const ComponentHeader = ({ title, buttonName, onClick, access = true }) => {
    return (
        <div className="component_page_header">
            <div className="component_page_title">{title}</div>
            {access && (
                <button className="create_component_button" onClick={onClick}>
                    {buttonName}
                </button>
            )}
        </div>
    );
};

export default ComponentHeader;
