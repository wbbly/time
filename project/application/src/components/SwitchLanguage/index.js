import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

// actions
import { setLanguage } from '../../actions/LanguageActions';

// styles
import './style.scss';

class SwitchLanguage extends Component {
    state = {
        isOpenDropdown: false,
    };

    isActive = language => {
        const { vocabulary } = this.props;
        const { lang } = vocabulary;

        return lang.short === language;
    };

    closeDropdown = event => {
        this.setState({ isOpenDropdown: false });
        document.removeEventListener('click', this.closeDropdown);
    };

    openDropdown = event => {
        document.addEventListener('click', this.closeDropdown);
        this.setState({ isOpenDropdown: true });
    };
    render() {
        const { dropdown, setLanguage, isMobile, vocabulary, languages } = this.props;
        const { isOpenDropdown } = this.state;
        const { v_language, lang } = vocabulary;

        return (
            <div
                className={classNames('wrapper-switch-language', {
                    'wrapper-switch-language--dropdown': dropdown,
                    'wrapper-switch-language--block': !dropdown,
                    'wrapper-switch-language--mobile': isMobile,
                })}
            >
                {dropdown ? (
                    <>
                        <div className="wrapper-switch-language__title">{v_language}:</div>
                        <div className="wrapper-switch-language__select" onClick={this.openDropdown}>
                            <span>{lang.long}</span>

                            {isOpenDropdown && (
                                <div className="wrapper-switch-language__list">
                                    {languages.map(item => (
                                        <div
                                            key={item.long}
                                            className="wrapper-switch-language__list-item"
                                            onClick={event => {
                                                setLanguage(item.short);
                                            }}
                                        >
                                            {item.long}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <i className="wrapper-switch-language__icon-arrow" />
                        </div>
                    </>
                ) : (
                    <ul className="wrapper-switch-language__list">
                        {languages.map(item => (
                            <li
                                key={item.short}
                                className={classNames('wrapper-switch-language__list-item', {
                                    'wrapper-switch-language__list-item--active': this.isActive(item.short),
                                })}
                                onClick={event => setLanguage(item.short)}
                            >
                                {item.short}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    languages: state.languageReducer.languages,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    setLanguage,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SwitchLanguage);
