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

export const ClientComponent = ({ client, vocabulary, index, editClient, isMobile }) => {
    const { v_client_name, v_language, v_phone, v_address, v_project, company_name, v_email } = vocabulary;
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
        <div>
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
                    <EditIcon className="client_edit" onClick={() => editClient(index)} />
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
