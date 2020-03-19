import React, { useState, useEffect } from 'react';
import moment from 'moment';

import classNames from 'classnames';

import './style.scss';

const FakeTimerArray = [
    {
        day: `Today, ${moment().format('DD.MM.YYYY')}`,
        tottalTime: 'Total time: 8:23:12',
        tasks: [
            {
                name: 'Task name and number №431',
                project: 'Project name',
                time: '10:00 AM - 18:23 PM',
                timer: '8:23:12',
            },
        ],
    },
    {
        day: `Yesterday, ${moment()
            .subtract(1, 'day')
            .format('DD.MM.YYYY')}`,
        tottalTime: 'Total time: 16:46:24',
        tasks: [
            {
                name: 'Task name and number №4278',
                project: 'Some project',
                time: '10:00 AM - 18:23 PM',
                timer: '8:23:12',
            },
            {
                name: 'Task name and number №54153412318335',
                project: 'Some project',
                time: '10:00 AM - 18:23 PM',
                timer: '8:23:12',
            },
        ],
    },
    {
        day: `${moment()
            .subtract(1, 'week')
            .format('dddd, DD.MM.YYYY')}`,
        tottalTime: 'Total time: 8:23:12',
        tasks: [
            {
                name: 'Task name and number №976',
                project: 'My project',
                time: '10:00 AM - 18:23 PM',
                timer: '8:23:12',
            },
        ],
    },
];

//-----Icons-----

const PlayIconMobile = ({ className, style }) => (
    <svg
        className={className}
        style={{ ...style }}
        viewBox="24 20 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g filter="url(#filter0_d)">
            <circle cx="49" cy="45" r="25" fill="#27AE60" />
        </g>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M58.1441 43.4936L45.7085 35.1956C45.3409 34.9638 44.8844 35.0024 44.5396 35.0024C43.1606 35.0024 43.1667 36.13 43.1667 36.4157V53.3759C43.1667 53.6174 43.1606 54.7893 44.5396 54.7893C44.8844 54.7893 45.341 54.8277 45.7085 54.596L58.144 46.2981C59.1647 45.6549 58.9884 44.8958 58.9884 44.8958C58.9884 44.8958 59.1648 44.1367 58.1441 43.4936Z"
            fill="white"
        />
        <defs>
            <filter
                id="filter0_d"
                x="0"
                y="0"
                width="98"
                height="98"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="12" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
        </defs>
    </svg>
);

const StopIconMobile = ({ className, style }) => (
    <div className="current-task-mobile" style={{ order: '2', backgroundColor: '#585858', ...style }}>
        <div className="current-task-mobile__task-info">
            <div className="current-task-mobile__task-timer">09:00:01</div>
            <div className="current-task-mobile__task-name">Your task name here</div>
        </div>
        <svg className={className} viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="23.5" cy="23.5" r="23.5" fill="#EB5757" />
            <rect x="15.6666" y="15.6666" width="15.6667" height="15.6667" rx="2" fill="white" />
        </svg>
    </div>
);

const PlayIcon = ({ className, style }) => (
    <svg
        className={className}
        style={{ ...style }}
        width="12"
        height="15"
        viewBox="0 0 12 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.3513 6.43723L1.92647 0.14824C1.64784 -0.0274411 1.30186 0.00182833 1.04056 0.00182833C-0.00463631 0.00182833 3.58597e-07 0.856458 3.58597e-07 1.07297V13.927C3.58597e-07 14.11 -0.00457534 14.9982 1.04056 14.9982C1.30186 14.9982 1.6479 15.0273 1.92647 14.8517L11.3513 8.56279C12.1248 8.07529 11.9912 7.49998 11.9912 7.49998C11.9912 7.49998 12.1249 6.92467 11.3513 6.43723Z"
            fill="#6FCF97"
        />
    </svg>
);

const EditIcon = ({ className, style }) => (
    <svg className={className} style={{ ...style }} viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8147 3.20179L15.6797 7.06678L5.89624 16.8502L2.0334 12.9852L11.8147 3.20179ZM18.6125 2.26964L16.8889 0.545986C16.2227 -0.120146 15.1411 -0.120146 14.4727 0.545986L12.8216 2.19707L16.6866 6.0621L18.6125 4.1362C19.1292 3.61951 19.1292 2.7863 18.6125 2.26964ZM0.0107555 18.4178C-0.0595831 18.7344 0.226226 19.018 0.542821 18.941L4.84975 17.8968L0.98691 14.0318L0.0107555 18.4178Z" />
    </svg>
);

const DeleteIcon = ({ className, style }) => (
    <svg
        className={className}
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ ...style }}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.28273 7.50004L14.6308 2.15198C15.1231 1.65968 15.1231 0.861516 14.6308 0.369292C14.1385 -0.123003 13.3404 -0.123003 12.8481 0.369292L7.49997 5.71742L2.15185 0.369221C1.65956 -0.123074 0.861463 -0.123074 0.369168 0.369221C-0.123056 0.861516 -0.123056 1.65968 0.369168 2.15191L5.71729 7.49996L0.369168 12.8481C-0.123056 13.3404 -0.123056 14.1386 0.369168 14.6308C0.861463 15.1231 1.65956 15.1231 2.15185 14.6308L7.49997 9.28265L12.8481 14.6308C13.3403 15.1231 14.1385 15.1231 14.6308 14.6308C15.1231 14.1385 15.1231 13.3404 14.6308 12.8481L9.28273 7.50004Z"
            fill="#EB5757"
        />
    </svg>
);

const CloseIconModal = ({ className }) => (
    <svg className={className} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18.5023 0.132198C18.326 -0.0440659 18.0375 -0.0440659 17.8612 0.132198L11.3205 6.67289C11.1443 6.84916 10.8557 6.84916 10.6795 6.67289L4.13891 0.132198C3.96265 -0.0440659 3.67414 -0.0440659 3.49787 0.132198L0.132198 3.49775C-0.0440659 3.67401 -0.0440659 3.96252 0.132198 4.13879L6.67289 10.6795C6.84916 10.8557 6.84916 11.1443 6.67289 11.3205L0.132198 17.8612C-0.0440659 18.0375 -0.0440659 18.326 0.132198 18.5023L3.49775 21.8678C3.67401 22.0441 3.96252 22.0441 4.13879 21.8678L10.6795 15.3271C10.8557 15.1508 11.1443 15.1508 11.3205 15.3271L17.8611 21.8677C18.0374 22.0439 18.3259 22.0439 18.5021 21.8677L21.8677 18.5021C22.0439 18.3259 22.0439 18.0374 21.8677 17.8611L15.3271 11.3205C15.1508 11.1443 15.1508 10.8557 15.3271 10.6795L21.8677 4.13891C22.0439 3.96265 22.0439 3.67414 21.8677 3.49787L18.5023 0.132198Z"
            fill="#828282"
        />
    </svg>
);

const PlayIconModal = ({ className }) => (
    <svg className={className} viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.1891 7.72468L2.40808 0.177888C2.0598 -0.0329294 1.62733 0.002194 1.3007 0.002194C-0.00579539 0.002194 4.48246e-07 1.02775 4.48246e-07 1.28757V16.7124C4.48246e-07 16.932 -0.00571918 17.9978 1.3007 17.9978C1.62733 17.9978 2.05988 18.0328 2.40808 17.8221L14.1891 10.2753C15.1561 9.69034 14.989 8.99997 14.989 8.99997C14.989 8.99997 15.1561 8.3096 14.1891 7.72468Z"
            fill="white"
        />
    </svg>
);

//-----Parts-----

const Aside = ({ isMobile }) => (
    <aside className={!isMobile ? 'aside' : 'aside--hide'}>
        <div className="wrapper">
            <div className="navigation_links_container">
                <i className="logo_small" />
                <div className="navigation_links" style={{ backgroundColor: '#4f4f4f' }}>
                    <i className="timer" />
                    <div className="links_text">Timer</div>
                    <div className="timer_task">7:25:44</div>
                </div>
                <div className="navigation_links">
                    <i className="reports" />
                    <div className="links_text">Reports</div>
                </div>
                <div className="navigation_links">
                    <i className="projects" />
                    <div className="links_text">Projects</div>
                </div>
                <div className="navigation_links">
                    <i className="clients" />
                    <div className="links_text">Clietns</div>
                </div>
                <div className="wrapper-position-add-team">
                    <div className="navigation_links">
                        <i className="team" />
                        <div className="links_text">Team</div>
                        <div className="team_add_wrapper">
                            <span className="team_add">
                                <i className="team_add_plus" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="team_list">
                    <ul>
                        <li>
                            <div className="team_list-item active">
                                Lazy Ants
                                <div className="active-point" />
                            </div>
                        </li>
                        <li>
                            <div className="team_list-item">My Team</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </aside>
);

const Main = ({ mStep, dStep, isMobile }) => (
    <div className="main">
        <div
            className={classNames('main-page', {
                'main-page--mobile': isMobile,
            })}
        >
            {(mStep === 1 || mStep === 2 || mStep === 3) && <ModalEditTask mStep={mStep} />}
            {!isMobile ? (
                <div className="add-task" style={!isMobile ? { position: 'relative', zIndex: !dStep && '100' } : null}>
                    <input className="add-task__input" placeholder="Add your task name" />
                    <svg
                        style={{ marginRight: '15px', zIndex: dStep === 1 && '100' }}
                        className="project-list-popup__folder-icon"
                        width="24"
                        height="20"
                        viewBox="0 0 24 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9.6 0.399902H2.4C1.08 0.399902 0 1.4799 0 2.7999V17.1999C0 18.5199 1.08 19.5999 2.4 19.5999H21.6C22.92 19.5999 24 18.5199 24 17.1999V5.1999C24 3.8799 22.92 2.7999 21.6 2.7999H12L9.6 0.399902Z"
                            fill="#C1C0C0"
                        />
                    </svg>
                    <span className="add-task__duration">{dStep === 3 || dStep === 4 ? '00:15:24' : '00:00:00'}</span>

                    {dStep === 3 || dStep === 4 ? (
                        <svg
                            className="add-task__stop-icon"
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ zIndex: dStep === 3 && '100' }}
                        >
                            <circle className="add-task__stop-icon-circle" cx="18" cy="18" r="18" fill="#EB5757" />
                            <rect x="12" y="12" width="12" height="12" rx="2" fill="white" />
                        </svg>
                    ) : (
                        //desctop play or stop button
                        <svg
                            className="add-task__play-icon"
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ zIndex: dStep === 2 && '100' }}
                        >
                            <circle className="add-task__play-icon-circle" cx="18" cy="18" r="18" fill="#27AE60" />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M24.3513 16.4372L14.9265 10.1482C14.6478 9.97256 14.3019 10.0018 14.0406 10.0018C12.9954 10.0018 13 10.8565 13 11.073V23.927C13 24.11 12.9954 24.9982 14.0406 24.9982C14.3019 24.9982 14.6479 25.0273 14.9265 24.8517L24.3513 18.5628C25.1248 18.0753 24.9912 17.5 24.9912 17.5C24.9912 17.5 25.1249 16.9247 24.3513 16.4372Z"
                                fill="white"
                            />
                        </svg>
                    )}
                    <ArrowPointerBox dStep={dStep} mStep={mStep} isMobile={isMobile} />
                </div>
            ) : mStep === 0 ? (
                <PlayIconMobile className="play-icon-large-mobile" style={{ zIndex: '100' }} />
            ) : (
                (mStep === 4 || mStep === 5) && (
                    <StopIconMobile
                        className="current-task-mobile__stop-icon"
                        style={mStep === 4 ? { zIndex: '100' } : null}
                    />
                )
            )}
            <div
                style={{
                    position: 'relative',
                    overFlow: 'hidden',
                    width: '100%',
                    height: '100%',
                    zIndex: '-1',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        right: '0px',
                        bottom: '0px',
                        overFlow: 'scroll',
                        marginRight: '0px',
                        marginBottom: '0px',
                    }}
                />
                {FakeTimerArray.map(el => (
                    <div key={el.day} className="main-page__list">
                        <div className="main-page__day">
                            <div className="main-page__day-header">
                                <div className="main-page__day-date">{el.day}</div>
                                <div className="main-page__day-date-all-time">{el.tottalTime}</div>
                            </div>
                            {el.tasks.map(item => (
                                <div
                                    key={item.name}
                                    className={classNames('task-item', {
                                        'task-item--mobile': isMobile,
                                    })}
                                >
                                    <p className="task-item__issue">{item.name}</p>
                                    <div className="project-list-popup project-list-popup--list-item">
                                        <div className="project-list-popup__selected-project">
                                            <span
                                                className="project-list-popup__circle"
                                                style={{ backgroundColor: 'green' }}
                                            />
                                            <span className="project-list-popup__project-name">{item.project}</span>
                                        </div>
                                    </div>
                                    <p className="task-item__period-time">{item.time}</p>
                                    <p className="task-item__duration-time">{item.timer}</p>
                                    <div style={{ marginLeft: '10px', marginTop: '3px' }}>
                                        <PlayIcon className="task-item__play-icon" />
                                        <EditIcon className="task-item__edit-icon" />
                                        <DeleteIcon className="task-item__delete-icon" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ModalEditTask = ({ mStep }) => (
    <div
        className="start-edit-task-modal"
        style={{ zIndex: 'auto', backgroundColor: 'transparent', position: 'absolute', animation: 'none' }}
    >
        <div className="start-edit-task-modal__form">
            <CloseIconModal className="start-edit-task-modal__close-icon" />
            <div className="start-edit-task-modal__label">Enter your task name here</div>
            <input
                type="text"
                className="start-edit-task-modal__task-name-input"
                value={'Add your task name here'}
                readOnly
                style={mStep === 1 ? { zIndex: '100', position: 'relative' } : null}
            />
            <div className="start-edit-task-modal__label">Project</div>
            <div className="start-edit-task-modal__projects-dropdown">
                <div
                    className="start-edit-task-modal__projects-selected"
                    style={mStep === 2 ? { zIndex: '100', position: 'relative', backgroundColor: '#ffffff' } : null}
                >
                    <span className="start-edit-task-modal__projects-selected-circle" style={{ background: 'green' }} />
                    <span className="start-edit-task-modal__projects-selected-name">Select or create project </span>
                </div>
            </div>

            <button
                type="submit"
                className="start-edit-task-modal__submit-button"
                style={mStep === 3 ? { zIndex: '100', position: 'relative' } : null}
            >
                <span className="start-edit-task-modal__submit-button-text">Start Timer</span>
                <PlayIconModal className="start-edit-task-modal__submit-button-play-icon" />
            </button>
        </div>
    </div>
);

const ArrowPointerBox = ({ dStep, mStep, isMobile }) => {
    if (!isMobile) {
        const reverseFlex = dStep === 0 ? 'row-reverse' : 'row';
        const flipArrow = dStep === 0 ? 'scaleX(-1)' : 'none';
        let position;
        let text;
        switch (dStep) {
            case 0:
                text = 'Add the name of your task';
                position = { left: '20px' };
                break;
            case 1:
                text = 'Choose your project';
                position = { right: '140px' };
                break;
            case 2:
                text = 'You are ready to start, click on the play button';
                position = { right: '26px' };
                break;
            case 3:
                text = 'Stop the timer when complete task';
                position = { right: '26px' };
                break;
            default:
                text = '';
                position = {};
                break;
        }
        if (dStep > 3) return null;
        return (
            <div className="tutorial-pointer" style={{ display: 'flex', flexDirection: reverseFlex, ...position }}>
                <div className="tutorial-pointer__text-box">{text}</div>
                <div className="tutorial-pointer__arrow-container" style={{ transform: flipArrow }}>
                    <div className="tutorial-pointer__arrow">
                        <div className="tutorial-pointer__curve" />
                        <div className="tutorial-pointer__point" />
                    </div>
                </div>
            </div>
        );
    } else {
        const reverseFlex = 'row';
        const flipArrow = 'scaleY(-1)';
        let position;
        let text;
        switch (mStep) {
            case 0:
                text = 'To start click on the play button';
                position = {};
                break;
            case 1:
                text = 'Enter the name of your task';
                position = { bottom: '180px' };
                break;
            case 2:
                text = 'Choose or create your project';
                position = { bottom: '115px' };
                break;
            case 3:
                text = 'You are ready to start, click on the button';
                position = { bottom: '70px' };
                break;
            case 4:
                text = 'Stop the timer when complete the task';
                position = {};
                break;
            default:
                text = '';
                position = {};
                break;
        }
        if (mStep > 4) return null;
        return (
            <div
                className={classNames('tutorial-pointer', { 'tutorial-pointer--mobile': isMobile })}
                style={{ display: 'flex', flexDirection: reverseFlex, ...position }}
            >
                <div className="tutorial-pointer__text-box">{text}</div>
                <div className="tutorial-pointer__arrow-container" style={{ transform: flipArrow }}>
                    <div className="tutorial-pointer__arrow">
                        <div className="tutorial-pointer__curve" />
                        <div className="tutorial-pointer__point" />
                    </div>
                </div>
            </div>
        );
    }
};

const Arrows = ({ className, swipeArrowNumber }) => (
    <div className={className}>
        <div className={swipeArrowNumber === 0 ? 'swipe-arrow' : 'swipe-arrow--none'} />
        <div className={swipeArrowNumber === 1 ? 'swipe-arrow' : 'swipe-arrow--none'} />
        <div className={swipeArrowNumber === 2 ? 'swipe-arrow' : 'swipe-arrow--none'} />
    </div>
);

//------------------------------COMPONENT---------------------------------

const DesctopTutorial = ({ isMobile, dStep, mStep, prevPage, nextPage, finish }) => {
    const [swipeArrowNumber, setSwipeArrowNumber] = useState(0);

    useEffect(() => {
        //swipe arrows slider
        const interval = setInterval(() => {
            setSwipeArrowNumber(swipeArrowNumber => (swipeArrowNumber === 2 ? 0 : swipeArrowNumber + 1));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div
            className="wrapper-page-template"
            style={{
                position: 'fixed',
                left: '0',
                top: '0',
                right: '0',
                bottom: '0',
                width: '100%',
                height: '100%',
            }}
        >
            {isMobile ? <ArrowPointerBox dStep={dStep} mStep={mStep} isMobile={isMobile} /> : null}
            {isMobile ? (
                <div className="main-header">
                    <i className="main-header__small-logo" />
                    <button className="main-header__show-menu-button">
                        <span className="main-header__show-menu-button-icon" />
                    </button>
                </div>
            ) : null}
            <div className="wrapper-main-content">
                <Aside isMobile={isMobile} />
                <Main mStep={mStep} dStep={dStep} isMobile={isMobile} />
                {!isMobile && dStep !== 4 ? (
                    <div className="middle-buttons">
                        {!dStep ? (
                            <div className="middle-buttons__start-text">
                                <p className="middle-buttons__text-larg">Welcome to Wobbly</p>
                                <p className="middle-buttons__text-small">Begin tracking your time now</p>
                            </div>
                        ) : (
                            <div className="middle-buttons__start-text" />
                        )}
                        <div className="middle-buttons__steps">
                            <button style={{ backgroundColor: '#EB5757' }} onClick={prevPage}>
                                Previous Step
                            </button>
                            <button onClick={nextPage}>Next Step</button>
                        </div>
                    </div>
                ) : (
                    (mStep === 5 || dStep === 4) && (
                        <div className={classNames('middle-buttons', { 'middle-buttons--mobile': isMobile })}>
                            <div className="middle-buttons__finish">
                                <p className="middle-buttons__text-larg">Use Wobbly with pleasure</p>
                                <button className="middle-buttons__end-tutorial" onClick={finish}>
                                    Finish Tutorial
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>

            <div className="tutorial-box-shadow">
                <button onClick={finish} className={classNames('skip-btn', { 'skip-btn--mobile': isMobile })}>
                    Skip Tutorial
                </button>
                {isMobile && mStep < 5 ? (
                    <div className="swipe-arrows-container">
                        <Arrows className={'left-swipe-arrows'} swipeArrowNumber={swipeArrowNumber} />
                        <Arrows className={'right-swipe-arrows'} swipeArrowNumber={swipeArrowNumber} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};
export default DesctopTutorial;
