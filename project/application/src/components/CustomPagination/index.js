import React from 'react';
import ReactPaginate from 'react-paginate';
import './style.scss';

const CustomPagination = () => {
    return (
        <div className="custom-pagination">
            <ReactPaginate previousLabel={'<'} nextLabel={'>'} />
        </div>
    );
};
export default CustomPagination;
