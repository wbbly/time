import React, { useState } from 'react';

// Styles
import './style.scss';

export const ClientComponent = ({ client, vocabulary, index, editClient }) => {
    const { v_client_name, v_language, v_phone, v_address, v_project, company_name } = vocabulary;
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
                    {/* <div
                            className="clients_list_item-avatar"
                            style={{
                                backgroundImage: `url("${
                                    client.avatar ? AppConfig.clientUrl + client.avatar : defaultImage
                                }`,
                            }}
                        /> */}

                    <div className="client_name" style={!isAdditionalClientlData ? { marginLeft: '27px' } : {}}>
                        <div>{`${company_name}: `}</div>
                        <div>{client.company_name}</div>
                    </div>
                </div>
                <div className="email-edit-wrapper">
                    <div className="client_mail">{client.email}</div>

                    <i className="client_edit" onClick={() => editClient(index)} />
                </div>
            </div>
            {isOpenDropdown &&
                isAdditionalClientlData && (
                    <div className="clients-list__additional-information">
                        <div className="common-block">
                            <div className="clients-list__additional-information-data">
                                {client.name && <div className="language-title">{`${v_client_name}:`}</div>}
                                {client.language && <div className="language-title">{`${v_language}:`}</div>}
                                {client.phone && <div className="phone-title">{`${v_phone}:`}</div>}
                                {isAddress && <div className="address-title">{`${v_address}:`}</div>}
                                {client.project.length !== 0 && <div className="project-title">{`${v_project}:`}</div>}
                            </div>
                            <div className="clients-list__additional-information-data">
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
