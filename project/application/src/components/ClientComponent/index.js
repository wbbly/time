import React, { useState } from 'react';
import classNames from 'classnames';

// Config
import { AppConfig } from '../../config';

// Styles
import './style.scss';
import defaultImage from '../../images/icons/user.svg';

const EditIcon = ({ className, onClick }) => (
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

export const ClientComponent = ({ client, vocabulary, index, editClient, isMobile, changeClientActiveStatus }) => {
    const {
        v_client_name,
        v_language,
        v_phone,
        v_address,
        v_project,
        company_name,
        v_email,
        v_filter_archived,
    } = vocabulary;
    const [isOpenDropdown, setDropDown] = useState(false);
    const isAddress = client.country || client.city || client.zip || client.state;
    const isAdditionalClientlData =
        client.country ||
        client.city ||
        client.zip ||
        client.state ||
        client.language ||
        client.name ||
        client.phone ||
        client.project.length > 0;
    return (
        <div className="clients-list__item-wrap">
            <div className="clients-list__item" key={index}>
                <div className="clients-list__item-data-wrapper">
                    <div className="client_arrow">
                        {isAdditionalClientlData && (
                            <div
                                className={'arrow-space'}
                                onClick={() => {
                                    setDropDown(!isOpenDropdown);
                                }}
                                style={{ cursor: 'cursorPointer' }}
                            >
                                <i className={isOpenDropdown ? 'arrow-up' : 'arrow-down'} />
                            </div>
                        )}
                    </div>
                    <div
                        className={classNames('client_avatar', {
                            'avatar-cover': client.avatar,
                        })}
                        style={{
                            backgroundImage: `url("${client.avatar ? AppConfig.apiURL + client.avatar : defaultImage}`,
                        }}
                    />
                    <div className="client_name">
                        <div className="client_name_title">{`${company_name}: `}</div>
                        <div className="client_name_value">{client.company_name}</div>
                    </div>
                </div>
                <div className="email-edit-wrapper">
                    {!isMobile && <div className="client_mail">{client.email}</div>}
                    {client.is_active ? (
                        <div className="clients-list__buttons">
                            <EditIcon className="client_edit" onClick={() => editClient(index)} />
                            <AddToArchiveIcon
                                className="client_archive"
                                onClick={e => changeClientActiveStatus(client.id, false)}
                            />
                        </div>
                    ) : (
                        <div className="unarchive-wrap">
                            <div className="unarchive-wrap__text">{v_filter_archived}</div>
                            <RemoveFromArchiveIcon
                                className="unarchive-wrap__button"
                                onClick={e => changeClientActiveStatus(client.id, true)}
                            />
                        </div>
                    )}
                </div>
            </div>
            {isOpenDropdown &&
                isAdditionalClientlData && (
                    <div className="clients-list__additional-information">
                        <div className="common-block">
                            <div className="clients-list__additional-information-data">
                                {client.email && isMobile && <div className="language-title">{`${v_email}:`}</div>}
                                {client.name && <div className="language-title">{`${v_client_name}:`}</div>}
                                {client.language && <div className="language-title">{`${v_language}:`}</div>}
                                {client.phone && <div className="phone-title">{`${v_phone}:`}</div>}
                                {isAddress && <div className="address-title">{`${v_address}:`}</div>}
                                {client.project.length !== 0 && <div className="project-title">{`${v_project}:`}</div>}
                            </div>
                            <div className="clients-list__additional-information-data">
                                {client.email && isMobile && <div className="language-title">{client.email}</div>}
                                {client.name && <div className="language-title">{client.name}</div>}
                                {client.language && <div className="language-title">{client.language}</div>}
                                {client.phone && <div className="phone">{client.phone}</div>}
                                {isAddress && (
                                    <div className="address">{`${(client.country && client.country) ||
                                        '-'}${(client.state && ', ' + client.state) || ''}${(client.city &&
                                        ', ' + client.city) ||
                                        ''}${(client.zip && ', ' + client.zip) || ''}`}</div>
                                )}
                                {client.project.length !== 0 && (
                                    <div className="project">
                                        {client.project.map((project, key) => {
                                            return (
                                                <div key={key} className="project-title">
                                                    <div
                                                        style={{ backgroundColor: `${project.project_color.name}` }}
                                                        className="circle"
                                                    />
                                                    {project.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};
