import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import './style.scss';
import { AppConfig } from '../../config';

// Services
import { checkIsAdminByRole, checkIsOwnerByRole, ROLES } from '../../services/authentication';
import { deleteUserFromProjectAction, getProjectsListActions } from '../../actions/ProjectsActions';

const EditIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        // width="20"
        // height="20"
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

const AddToArchiveIcon = ({ className, onClick }) => (
    <svg className={className} onClick={onClick} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.49999 5.83325C2.96023 5.83325 3.33332 6.20635 3.33332 6.66659V16.6666H16.6667V6.66659C16.6667 6.20635 17.0398 5.83325 17.5 5.83325C17.9602 5.83325 18.3333 6.20635 18.3333 6.66659V17.4999C18.3333 17.9602 17.9602 18.3333 17.5 18.3333H2.49999C2.03975 18.3333 1.66666 17.9602 1.66666 17.4999V6.66659C1.66666 6.20635 2.03975 5.83325 2.49999 5.83325Z"
            fill="#D3DCE6"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 2.50008C0 2.03984 0.373096 1.66675 0.833333 1.66675H19.1667C19.6269 1.66675 20 2.03984 20 2.50008V6.66675C20 7.12699 19.6269 7.50008 19.1667 7.50008H0.833333C0.373096 7.50008 0 7.12699 0 6.66675V2.50008ZM1.66667 3.33341V5.83341H18.3333V3.33341H1.66667Z"
            fill="#D3DCE6"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.5 10.0001C7.5 9.53984 7.8731 9.16675 8.33333 9.16675H11.6667C12.1269 9.16675 12.5 9.53984 12.5 10.0001C12.5 10.4603 12.1269 10.8334 11.6667 10.8334H8.33333C7.8731 10.8334 7.5 10.4603 7.5 10.0001Z"
            fill="#D3DCE6"
        />
    </svg>
);

const RemoveFromArchiveIcon = ({ className, onClick }) => (
    <svg className={className} onClick={onClick} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0)">
            <path
                d="M0.833344 3.33325V8.33325H5.83334"
                stroke="#F3AD26"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.92501 12.5C3.46534 14.0337 4.48946 15.3502 5.84306 16.2512C7.19666 17.1522 8.80641 17.5889 10.4298 17.4954C12.0531 17.402 13.6022 16.7835 14.8434 15.7332C16.0847 14.6828 16.9511 13.2575 17.3119 11.672C17.6727 10.0865 17.5084 8.42667 16.8439 6.94262C16.1793 5.45857 15.0504 4.2307 13.6274 3.44401C12.2043 2.65732 10.5641 2.35442 8.95391 2.58097C7.34372 2.80751 5.85077 3.55122 4.70001 4.70004L0.833344 8.33337"
                stroke="#F3AD26"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const DeleteIcon = ({ className, onClick }) => (
    <svg className={className} onClick={onClick} viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.11286 19.4171C3.11286 19.4171 3.4922 20.831 5.44478 20.831H14.2735C16.226 20.831 16.6053 19.4171 16.6053 19.4171L18.3483 5.55496H1.37001L3.11286 19.4171ZM13.2548 7.63809C13.2548 7.25456 13.6348 6.94374 14.1037 6.94374C14.5726 6.94374 14.9527 7.25456 14.9527 7.63809L14.1037 18.0536C14.1037 18.4371 13.7236 18.7479 13.2548 18.7479C12.786 18.7479 12.4059 18.437 12.4059 18.0536L13.2548 7.63809ZM9.01025 7.63809C9.01025 7.25456 9.39035 6.94374 9.85915 6.94374C10.328 6.94374 10.708 7.25456 10.708 7.63809V18.0536C10.708 18.4371 10.328 18.7479 9.85915 18.7479C9.39026 18.7479 9.01025 18.437 9.01025 18.0536V7.63809ZM5.61458 6.94366C6.08347 6.94366 6.46347 7.25449 6.46347 7.63801L7.31246 18.0535C7.31246 18.437 6.93236 18.7479 6.46347 18.7479C5.99468 18.7479 5.61458 18.437 5.61458 18.0535L4.76568 7.63809C4.76568 7.25456 5.14578 6.94366 5.61458 6.94366ZM17.8389 2.77857H14.1037V1.38878C14.1037 0.335343 13.6872 0 12.4059 0H7.31237C6.13716 0 5.61458 0.465616 5.61458 1.38878V2.77864H1.87941C1.12869 2.77864 0.521118 3.24473 0.521118 3.82067C0.521118 4.3967 1.12869 4.86278 1.87941 4.86278H17.8389C18.5896 4.86278 19.1972 4.3967 19.1972 3.82067C19.1972 3.24473 18.5896 2.77857 17.8389 2.77857ZM12.4059 2.77857H7.31246L7.31256 1.3887H12.406V2.77857H12.4059Z"
            // fill="white"
        />
    </svg>
);

const ArrowSVG = ({ className }) => (
    <svg
        // width="20"
        // height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#E0E6ED"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ProjectsDataRow = ({
    projectData,
    vocabulary,
    setEditItem,
    currentTeam,
    durationTimeFormat,
    expandedStatus,
    changeProjectActiveStatus,
}) => {
    const [expanded, setExpanded] = useState(false);
    const { name, client, totalTime, projectColor, userProjects } = projectData;
    const { v_project_name, v_client, v_time, v_filter_archived } = vocabulary;
    useEffect(
        () => {
            if (expandedStatus) {
                if (!userProjects.length) return;
                setExpanded(true);
            } else setExpanded(false);
        },
        [expandedStatus, userProjects]
    );

    const dispatch = useDispatch();

    return (
        <>
            <tr
                onClick={() => {
                    if (!userProjects.length) return;
                    setExpanded(prev => !prev);
                }}
                className={classnames('project-row-data', {
                    'expanded-row': expanded,
                })}
            >
                <td className="project-row-data__toggle-container">
                    {!!userProjects.length && (
                        <div className="projects_toggle">
                            <div
                                className={classnames('projects_toggle-icon', {
                                    'projects_toggle-icon--rotated': expanded,
                                })}
                            >
                                <ArrowSVG className="projects_toggle-icon__img" />
                            </div>
                        </div>
                    )}
                </td>
                <td className="project-row-data__project-name" data-label={`${v_project_name}: `}>
                    {name}
                    <span
                        className="project-row-data__project-color-circle--mobile"
                        style={{ backgroundColor: projectColor.name }}
                    />
                </td>
                <td className="project-row-data__project-color">
                    <div
                        className="project-row-data__project-color-circle"
                        style={{ backgroundColor: projectColor.name }}
                    />
                </td>
                <td data-label={`${v_client}: `}>
                    {client ? `${client.company_name} ${client.name ? '(' + client.name + ')' : ''}` : '-'}
                </td>
                <td>
                    {(checkIsAdminByRole(currentTeam.data.role) || checkIsOwnerByRole(currentTeam.data.role)) &&
                        (projectData.isActive ? (
                            <div className="buttons-wrap">
                                <EditIcon
                                    className="edit_button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setEditItem(projectData);
                                    }}
                                />
                                <AddToArchiveIcon
                                    className="archive_button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        changeProjectActiveStatus(projectData.id, false);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="unarchive-wrap">
                                <div className="unarchive-wrap__text">{v_filter_archived}</div>
                                <RemoveFromArchiveIcon
                                    className="unarchive_button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        changeProjectActiveStatus(projectData.id, true);
                                    }}
                                />
                            </div>
                        ))}
                </td>
            </tr>
            {expanded &&
                !!userProjects.length &&
                userProjects.map((user, index) => (
                    <tr
                        className={classnames('project-expanded highlighted', {
                            'highlighted-last': index === userProjects.length - 1,
                        })}
                        key={user.id}
                    >
                        <td />
                        <td className="project-expanded__user">
                            <div className="project-expanded__user-avatar">
                                {!user.avatar ? (
                                    <div className="avatar-small" />
                                ) : (
                                    <div
                                        className="avatar-small avatar-cover"
                                        style={{
                                            backgroundImage: `url(${AppConfig.apiURL}${user.avatar})`,
                                        }}
                                    />
                                )}
                            </div>
                            <div className="project-expanded__user-name">{user.username}</div>
                        </td>
                        <td className="project-expanded__user-color" />
                        <td className="project-expanded__user-client" />
                        <td className="project-expanded__user-time">
                            {(checkIsAdminByRole(currentTeam.data.role) || checkIsOwnerByRole(currentTeam.data.role)) &&
                                user.role &&
                                !checkIsOwnerByRole(user.role) &&
                                !checkIsAdminByRole(user.role) && (
                                    <DeleteIcon
                                        className="project-expanded__edit-button-icon"
                                        onClick={async e => {
                                            e.stopPropagation();
                                            await dispatch(deleteUserFromProjectAction(user.id, projectData.id));
                                            await dispatch(
                                                getProjectsListActions({
                                                    page: 1,
                                                    withPagination: true,
                                                    withTimerList: false,
                                                })
                                            );
                                        }}
                                    />
                                )}
                        </td>
                    </tr>
                ))}
        </>
    );
};

export default ProjectsDataRow;
