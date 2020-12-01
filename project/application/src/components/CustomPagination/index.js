import React from 'react';
import ReactPaginate from 'react-paginate';
import './style.scss';

const CustomPagination = ({ page, pageCount, changePage }) => {
    return (
        <div className="custom-pagination">
            <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
                previousLabel={'<'}
                nextLabel={'>'}
                onPageChange={changePage}
                initialPage={page}
            />
        </div>
    );
};
export default CustomPagination;
