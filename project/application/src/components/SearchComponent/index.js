import React, { useRef } from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';

import './style.scss';

const SearchSVG = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15.75 15.75L12.4875 12.4875"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CloseSVG = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L4 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 4L12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SearchComponent = ({ value, setValue, handleSearch, handleReset, vocabulary }) => {
    const { v_search } = vocabulary;
    const inputRef = useRef(null);
    return (
        <div className="search-component">
            <div className="search-component__icon-container" onClick={() => handleSearch()}>
                <SearchSVG />
            </div>
            <form
                action="true"
                className={'search-component__form'}
                onSubmit={e => {
                    e.preventDefault();
                }}
            >
                <input
                    className="search-component__input"
                    type="search"
                    ref={inputRef}
                    placeholder={v_search}
                    value={value}
                    onChange={event => setValue(event.target.value)}
                    // onBlur={() => {
                    //     if (!value.length) {
                    //         handleReset();
                    //     }
                    // }}
                    onKeyUp={e => {
                        if (e.keyCode === 13) {
                            // e.target.blur();
                            handleSearch();
                        } else {
                            return;
                        }
                    }}
                />
            </form>
            {!!value.length && (
                <div
                    className="search-component__icon-container"
                    onClick={() => {
                        setValue('');
                        inputRef.current.focus();
                        // handleReset();
                    }}
                >
                    <CloseSVG />
                </div>
            )}
        </div>
    );
};

SearchComponent.propTypes = {
    value: Proptypes.string,
    setValue: Proptypes.func,
    handleSearch: Proptypes.func,
    handleReset: Proptypes.func,
    vocabulary: Proptypes.object,
};

const mapStateToProps = store => ({
    vocabulary: store.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(SearchComponent);
