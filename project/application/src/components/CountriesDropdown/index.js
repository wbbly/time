import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import countries from './countriesFlat.json';
import './style.scss';

const allCountriesArray = Object.keys(countries).map(item => ({ ...countries[item], code: item }));

const CountriesDropdown = ({ onSelect, inputPlaceholder, epmtyText, theme }) => {
    const [countriesArray, setCountriesArray] = useState(allCountriesArray);
    const [value, setValue] = useState('');

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(
        () => {
            const newArr = allCountriesArray.filter(
                item => item.name.common.toLowerCase().indexOf(value.toLowerCase()) >= 0
            );
            setCountriesArray(newArr);
        },
        [value]
    );

    return (
        <div
            className={classnames('countries-dropdown', {
                'countries-dropdown--dark': theme === 'dark',
            })}
        >
            <div className="countries-dropdown__input-container">
                <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className={classnames('countries-dropdown__input', {
                        'countries-dropdown__input--dark': theme === 'dark',
                    })}
                    placeholder={inputPlaceholder}
                    ref={inputRef}
                />
            </div>
            <div className="countries-dropdown__list">
                {!!countriesArray.length ? (
                    countriesArray.map(item => (
                        <div
                            key={item.code}
                            className={classnames('countries-dropdown__list-item', {
                                'countries-dropdown__list-item--dark': theme === 'dark',
                            })}
                            onClick={() => onSelect(item)}
                        >
                            <img src={item.flag} alt="country" className="countries-dropdown__list-item-flag" />
                            <div className="countries-dropdown__list-item-text">{item.name.common}</div>
                        </div>
                    ))
                ) : (
                    <div className="empty">{epmtyText}</div>
                )}
            </div>
        </div>
    );
};

CountriesDropdown.propTypes = {
    onSelect: PropTypes.func.isRequired,
    inputPlaceholder: PropTypes.string.isRequired,
    epmtyText: PropTypes.string.isRequired,
    theme: PropTypes.oneOf(['light', 'dark']),
};

CountriesDropdown.defaultProps = {
    theme: 'light',
};

export default CountriesDropdown;
