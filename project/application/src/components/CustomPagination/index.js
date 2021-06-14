import React from 'react';
import ReactPaginate from 'react-paginate';
import './style.scss';

const ChevronLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomPagination = ({ page, pageCount, changePage }) => {
    return (
        <div className="custom-pagination">
            <ReactPaginate
                forcePage={page}
                pageCount={pageCount}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
                previousLabel={<ChevronLeftIcon />}
                nextLabel={<ChevronRightIcon />}
                onPageChange={changePage}
            />
        </div>
    );
};
export default CustomPagination;
