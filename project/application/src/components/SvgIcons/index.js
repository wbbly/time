import React from 'react';

export const CopyLinkIcon = ({ className, onClick, valueTip }) => (
    <svg
        onClick={onClick}
        className={className}
        data-tip={valueTip}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.33398 10.834C8.69186 11.3124 9.14845 11.7083 9.67278 11.9947C10.1971 12.2812 10.7769 12.4516 11.3729 12.4942C11.9688 12.5369 12.567 12.4509 13.1268 12.2421C13.6866 12.0333 14.1949 11.7065 14.6173 11.284L17.1173 8.78396C17.8763 7.99811 18.2963 6.9456 18.2868 5.85312C18.2773 4.76063 17.8391 3.71558 17.0666 2.94304C16.294 2.17051 15.249 1.73231 14.1565 1.72281C13.064 1.71332 12.0115 2.1333 11.2257 2.89229L9.79232 4.31729"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11.6659 9.16702C11.308 8.68858 10.8514 8.2927 10.3271 8.00623C9.80274 7.71977 9.22293 7.54942 8.62698 7.50674C8.03103 7.46406 7.43287 7.55004 6.87307 7.75887C6.31327 7.96769 5.80493 8.29446 5.38252 8.71702L2.88252 11.217C2.12353 12.0029 1.70355 13.0554 1.71305 14.1479C1.72254 15.2403 2.16075 16.2854 2.93328 17.0579C3.70581 17.8305 4.75086 18.2687 5.84335 18.2782C6.93584 18.2877 7.98835 17.8677 8.77419 17.1087L10.1992 15.6837"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const EditIcon = ({ className, onClick, valueTip }) => (
    <svg
        data-tip={valueTip}
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SaveIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M17.5 12.5L17.5 15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5L4.16667 17.5C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333L2.5 12.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.83268 8.33398L9.99935 12.5007L14.166 8.33398"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M10 12.5L10 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CopyIcon = ({ className, onClick, valueTip }) => (
    <svg
        data-tip={valueTip}
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4.16602 12.4993H3.33268C2.89065 12.4993 2.46673 12.3238 2.15417 12.0112C1.84161 11.6986 1.66602 11.2747 1.66602 10.8327V3.33268C1.66602 2.89065 1.84161 2.46673 2.15417 2.15417C2.46673 1.84161 2.89065 1.66602 3.33268 1.66602H10.8327C11.2747 1.66602 11.6986 1.84161 12.0112 2.15417C12.3238 2.46673 12.4993 2.89065 12.4993 3.33268V4.16602"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const DeleteIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2.5 5H4.16667H17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
            d="M6.66602 4.99935V3.33268C6.66602 2.89065 6.84161 2.46673 7.15417 2.15417C7.46673 1.84161 7.89066 1.66602 8.33268 1.66602H11.666C12.108 1.66602 12.532 1.84161 12.8445 2.15417C13.1571 2.46673 13.3327 2.89065 13.3327 3.33268V4.99935M15.8327 4.99935V16.666C15.8327 17.108 15.6571 17.532 15.3445 17.8445C15.032 18.1571 14.608 18.3327 14.166 18.3327H5.83268C5.39065 18.3327 4.96673 18.1571 4.65417 17.8445C4.34161 17.532 4.16602 17.108 4.16602 16.666V4.99935H15.8327Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.33398 9.16602V14.166"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11.666 9.16602V14.166"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SendIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M18.3327 1.66602L9.16602 10.8327"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M18.3327 1.66602L12.4993 18.3327L9.16602 10.8327L1.66602 7.49935L18.3327 1.66602Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const MoreIcon = ({ className, onClick, valueTip }) => (
    <svg
        onClick={onClick}
        className={className}
        width="18"
        height="18"
        data-tip={valueTip}
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9 9.75C9.41421 9.75 9.75 9.41421 9.75 9C9.75 8.58579 9.41421 8.25 9 8.25C8.58579 8.25 8.25 8.58579 8.25 9C8.25 9.41421 8.58579 9.75 9 9.75Z"
            // fill="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.25 9.75C14.6642 9.75 15 9.41421 15 9C15 8.58579 14.6642 8.25 14.25 8.25C13.8358 8.25 13.5 8.58579 13.5 9C13.5 9.41421 13.8358 9.75 14.25 9.75Z"
            // fill="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3.75 9.75C4.16421 9.75 4.5 9.41421 4.5 9C4.5 8.58579 4.16421 8.25 3.75 8.25C3.33579 8.25 3 8.58579 3 9C3 9.41421 3.33579 9.75 3.75 9.75Z"
            // fill="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
