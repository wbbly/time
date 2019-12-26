import React from 'react';
import moment from 'moment';

import { PlayIcon, DeleteIcon, EditIcon } from '../TaskListItem';
import classNames from 'classnames';

import './style.scss';
import StartTaskMobile from '../StartTaskMobile';
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
                project: 'Project name',
                time: '10:00 AM - 18:23 PM',
                timer: '8:23:12',
            },
            {
                name: 'Task name and number №54153412318335',
                project: 'Project name',
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
                project: 'Project name',
                time: '10:00 AM - 18:23 PM',
                timer: '8:23:12',
            },
        ],
    },
];

const ArrowPointerBox = ({ style, step }) => {
    const reverseFlex = step === 0 ? 'row-reverse' : 'row';
    const flipArrow = step === 0 ? 'scaleX(-1)' : 'none';
    let position;
    let text;
    switch (step) {
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
    if (step > 3) return null;
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
};

const DesctopTutorial = ({ isMobile, step, prevPage, nextPage, finish }) => {
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
            {isMobile ? (
                <div className="main-header">
                    <i className="main-header__small-logo" />
                    <button className="main-header__show-menu-button">
                        <span className="main-header__show-menu-button-icon" />
                    </button>
                </div>
            ) : null}
            <div className="wrapper-main-content">
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
                <div className="main">
                    <div
                        className={classNames('main-page', {
                            'main-page--mobile': isMobile,
                        })}
                    >
                        {!isMobile ? (
                            <div
                                className="add-task"
                                style={!isMobile ? { position: 'relative', zIndex: !step && '100' } : null}
                            >
                                <input className="add-task__input" placeholder="Add your task name" />
                                <svg
                                    style={{ marginRight: '15px', zIndex: step === 1 && '100' }}
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
                                <span className="add-task__duration">
                                    {step === 3 || step === 4 ? '00:15:24' : '00:00:00'}
                                </span>

                                {step === 3 || step === 4 ? (
                                    <svg
                                        className="add-task__stop-icon"
                                        viewBox="0 0 36 36"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ zIndex: step === 3 && '100' }}
                                    >
                                        <circle
                                            className="add-task__stop-icon-circle"
                                            cx="18"
                                            cy="18"
                                            r="18"
                                            fill="#EB5757"
                                        />
                                        <rect x="12" y="12" width="12" height="12" rx="2" fill="white" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="add-task__play-icon"
                                        viewBox="0 0 36 36"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ zIndex: step === 2 && '100' }}
                                    >
                                        <circle
                                            className="add-task__play-icon-circle"
                                            cx="18"
                                            cy="18"
                                            r="18"
                                            fill="#27AE60"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M24.3513 16.4372L14.9265 10.1482C14.6478 9.97256 14.3019 10.0018 14.0406 10.0018C12.9954 10.0018 13 10.8565 13 11.073V23.927C13 24.11 12.9954 24.9982 14.0406 24.9982C14.3019 24.9982 14.6479 25.0273 14.9265 24.8517L24.3513 18.5628C25.1248 18.0753 24.9912 17.5 24.9912 17.5C24.9912 17.5 25.1249 16.9247 24.3513 16.4372Z"
                                            fill="white"
                                        />
                                    </svg>
                                )}
                                <ArrowPointerBox step={step} />
                            </div>
                        ) : (
                            <StartTaskMobile />
                        )}
                        <div>
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
                                                        <span className="project-list-popup__project-name">
                                                            {item.project}
                                                        </span>
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

                {!isMobile && step !== 4 ? (
                    <div className="middle-buttons">
                        {!step ? (
                            <div className="middle-buttons__start-text">
                                <p className="middle-buttons__text-larg">Welcom to Wobbly</p>
                                <p className="middle-buttons__text-small">Begin tracking your time now</p>
                            </div>
                        ) : null}
                        <div className="middle-buttons__steps">
                            <button style={{ backgroundColor: '#EB5757' }} onClick={prevPage}>
                                Previous Step
                            </button>
                            <button onClick={nextPage}>Next Step</button>
                        </div>
                    </div>
                ) : (
                    !isMobile && (
                        <div className="middle-buttons">
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
            {/* <div className="tutorial-box-shadow" /> */}
        </div>
    );
};
export default DesctopTutorial;
