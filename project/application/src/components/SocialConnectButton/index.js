import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import './style.scss';

// const FacebookIcon = props => {
//     const { className } = props;
//     return (
//         <svg
//             className={className}
//             width="26"
//             height="26"
//             viewBox="0 0 26 26"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path
//                 d="M13 0C5.81999 0 0 5.81999 0 13C0 20.18 5.81999 26 13 26C20.18 26 26 20.18 26 13C26 5.81999 20.18 0 13 0ZM13 23.9688C6.94195 23.9688 2.03125 19.0581 2.03125 13C2.03125 6.94195 6.94195 2.03125 13 2.03125C19.0581 2.03125 23.9688 6.94195 23.9688 13C23.9688 19.0581 19.0581 23.9688 13 23.9688Z"
//                 fill="white"
//             />
//             <path
//                 d="M16.085 11.01H13.8236V9.35959C13.8236 8.85336 14.3473 8.73595 14.5917 8.73595C14.8345 8.73595 16.0525 8.73595 16.0525 8.73595V6.50873L14.3783 6.5C12.094 6.5 11.5726 8.1607 11.5726 9.22553V11.01H9.91504V13.3047H11.5726C11.5726 16.2508 11.5726 19.5 11.5726 19.5H13.8236C13.8236 19.5 13.8236 16.2174 13.8236 13.3047H15.7358L16.085 11.01Z"
//                 fill="white"
//             />
//         </svg>
//     );
// };

// const LinkedInIcon = props => {
//     const { className } = props;
//     return (
//         <svg
//             className={className}
//             width="26"
//             height="26"
//             viewBox="0 0 26 26"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path
//                 d="M13 0C5.81999 0 0 5.81999 0 13C0 20.18 5.81999 26 13 26C20.18 26 26 20.18 26 13C26 5.81999 20.18 0 13 0ZM13 23.9688C6.94195 23.9688 2.03125 19.0581 2.03125 13C2.03125 6.94195 6.94195 2.03125 13 2.03125C19.0581 2.03125 23.9688 6.94195 23.9688 13C23.9688 19.0581 19.0581 23.9688 13 23.9688Z"
//                 fill="white"
//             />
//             <path
//                 d="M6.50488 19.4946H8.94238V9.74463H6.50488V19.4946ZM16.2549 9.74463C14.1681 9.77957 13.1414 11.3006 13.0049 11.3696V9.74463H10.5674V19.4946H13.0049V13.8071C13.0049 13.5985 13.519 11.9282 15.4424 12.1821C16.4755 12.2496 17.0324 13.6159 17.0674 13.8071V19.4946L19.4953 19.5057V12.7558C19.4097 11.7814 18.9225 9.77952 16.2549 9.74463ZM7.72363 6.49463C7.05078 6.49463 6.50488 7.03972 6.50488 7.71338C6.50488 8.38704 7.05078 8.93213 7.72363 8.93213C8.39648 8.93213 8.94238 8.38704 8.94238 7.71338C8.94238 7.03972 8.39648 6.49463 7.72363 6.49463Z"
//                 fill="white"
//             />
//         </svg>
//     );
// };

// const GoogleIcon = props => {
//     const { className } = props;
//     return (
//         <svg
//             className={className}
//             width="26"
//             height="26"
//             viewBox="0 0 26 26"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path
//                 d="M13.2641 10.7107V15.678H20.485C19.5407 18.6875 16.9747 20.8416 13.2641 20.8416C8.84539 20.8416 5.26347 17.3303 5.26347 13C5.26347 8.6697 8.84539 5.1584 13.2641 5.1584C15.2507 5.1584 17.0648 5.8721 18.4639 7.0473L22.1957 3.3891C19.8391 1.2844 16.7041 0 13.2641 0C5.93848 0 0 5.8201 0 13C0 20.1799 5.93848 26 13.2641 26C24.3984 26 26.8558 15.795 25.7643 10.7276L13.2641 10.7107Z"
//                 fill="white"
//             />
//         </svg>
//     );
// };

const ConnectedIcon = props => {
    const { className } = props;
    return (
        <svg
            className={className}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M13.0614 3.48626C12.4355 2.41385 11.5864 1.56475 10.5139 0.938805C9.44128 0.312892 8.27035 0 7.00022 0C5.73023 0 4.55894 0.312892 3.4865 0.938805C2.41399 1.56465 1.56488 2.41375 0.938905 3.48626C0.312894 4.55883 0 5.73011 0 7C0 8.26996 0.31299 9.44105 0.93881 10.5137C1.56476 11.5861 2.41386 12.4352 3.48637 13.0612C4.55894 13.6871 5.73013 14 7.0001 14C8.27006 14 9.44138 13.6871 10.5139 13.0612C11.5863 12.4354 12.4354 11.5861 13.0613 10.5137C13.6871 9.44114 14 8.26989 14 7C14 5.72998 13.6871 4.55867 13.0614 3.48626ZM11.539 5.93359L6.5899 10.8827C6.47442 10.9983 6.33475 11.056 6.1706 11.056C6.01263 11.056 5.87596 10.9983 5.76046 10.8827L2.46085 7.58333C2.3516 7.47386 2.29685 7.33741 2.29685 7.17319C2.29685 7.0031 2.35141 6.86324 2.46085 6.75383L3.29029 5.93359C3.40589 5.81815 3.54243 5.76043 3.70052 5.76043C3.85861 5.76043 3.99534 5.81819 4.11075 5.93359L6.17069 7.99346L9.88944 4.28386C10.0049 4.16839 10.1416 4.11064 10.2996 4.11064C10.4574 4.11064 10.5943 4.16839 10.7097 4.28386L11.5391 5.10422C11.6487 5.21353 11.7032 5.35327 11.7032 5.52336C11.7032 5.68749 11.6487 5.82422 11.539 5.93359Z"
                fill="white"
            />
        </svg>
    );
};

const PlusIcon = props => {
    const { className } = props;
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M8 3.33334V12.6667" stroke="white" strokeWidth="2" />
            <path d="M3.3335 8H12.6668" stroke="white" strokeWidth="2" />
        </svg>
    );
};

const CrossIcon = props => {
    const { className } = props;
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
        >
            <path
                d="M8.41016 0.0600899C8.33004 -0.02003 8.1989 -0.02003 8.11878 0.0600899L5.14572 3.03313C5.0656 3.11325 4.93446 3.11325 4.85434 3.03313L1.88133 0.0600899C1.80121 -0.02003 1.67007 -0.02003 1.58995 0.0600899L0.0600902 1.58989C-0.0200301 1.67 -0.0200301 1.80115 0.0600902 1.88127L3.03315 4.85431C3.11327 4.93443 3.11327 5.06557 3.03315 5.14569L0.0600902 8.11873C-0.0200301 8.19885 -0.0200301 8.33 0.0600902 8.41012L1.58989 9.93991C1.67001 10.02 1.80116 10.02 1.88128 9.93991L4.85434 6.96687C4.93446 6.88675 5.0656 6.88675 5.14572 6.96687L8.11872 9.93985C8.19884 10.02 8.32999 10.02 8.41011 9.93985L9.93991 8.41006C10.02 8.32994 10.02 8.1988 9.93991 8.11868L6.96691 5.14569C6.88679 5.06557 6.88679 4.93443 6.96691 4.85431L9.93991 1.88132C10.02 1.8012 10.02 1.67006 9.93991 1.58994L8.41016 0.0600899Z"
                fill="white"
            />
        </svg>
    );
};

export const SocialConnectButton = props => {
    const { type, textButton, connected, disabled, onClick, isFetching } = props;
    return (
        <div
            onClick={onClick}
            className={classNames('social-connect-button', `social-connect-button__${type}`, {
                'social-connect-button__disabled': disabled,
                'social-connect-button__connected': connected,
                'social-connect-button__is-fetching': isFetching,
            })}
        >
            {/* {type === 'facebook' && <FacebookIcon className="social-connect-button__social-icon" />}
            {type === 'linkedin' && <LinkedInIcon className="social-connect-button__social-icon" />}
            {type === 'google' && <GoogleIcon className="social-connect-button__social-icon" />} */}
            <span className="social-connect-button__text">{textButton}</span>
            {connected ? (
                <>
                    <ConnectedIcon className="social-connect-button__connected-icon" />
                    <CrossIcon className="social-connect-button__cross-icon" />
                </>
            ) : (
                <PlusIcon />
            )}
        </div>
    );
};

SocialConnectButton.propTypes = {
    type: PropTypes.oneOf(['facebook', 'linkedin', 'google']),
    textButton: PropTypes.string,
    connected: PropTypes.bool,
    disabled: PropTypes.bool,
    isFetching: PropTypes.bool,
    onClick: PropTypes.func,
};
