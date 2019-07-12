import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

// actions
import { setLanguage } from '../../actions/LanguageActions';

// styles
import './style.scss';

const languages = [{ short: 'ru', long: 'Russian' }, { short: 'en', long: 'English' }];

class SwitchLanguage extends Component {
    state = {
        isOpenDropdown: false,
    };

    isActive = (language, dropdown = false) => {
        const { vocabulary } = this.props;
        const { lang } = vocabulary;

        return dropdown ? lang.long : lang.short === language;
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
        const { dropdown, setLanguage, isMobile, vocabulary } = this.props;
        const { isOpenDropdown } = this.state;
        const { v_language } = vocabulary;

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
                            {this.isActive(null, dropdown)}

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
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    setLanguage,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SwitchLanguage);
