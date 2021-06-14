import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import './style.scss';

FilterByStatus.propTypes = {
    status: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    classes: PropTypes.string,
};

function FilterByStatus({ status, onClick, items, classes }) {
    const onStatusClick = event => {
        const statusName = event.target.getAttribute('name');
        onClick(statusName);
    };

    return (
        <div className={`filter-by-status ${classes ? classes : ''}`}>
            {items.map(element => (
                <div
                    key={element.id}
                    name={element.id}
                    className={ClassNames('filter-by-status__status', {
                        'filter-by-status__status--active': status === element.id,
                    })}
                    onClick={onStatusClick}
                >
                    {element.text}
                </div>
            ))}
        </div>
    );
}

export default FilterByStatus;
