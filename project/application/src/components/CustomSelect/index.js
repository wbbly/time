import React from 'react';
import './style.scss';

class CustomSelect extends React.Component {
    state = {
        isOpenDropdown: false,
    };

    closeDropdown = () => {
        document.removeEventListener('click', this.closeDropdown);
        this.props.onBlur(this.props.name, true);
        this.setState({ isOpenDropdown: false });
    };

    openDropdown = () => {
        document.addEventListener('click', this.closeDropdown);
        this.setState({ isOpenDropdown: true });
    };

    change = e => {
        if (this.props.addDays) {
            this.props.onChange(this.props.name, this.props.options.find(el => el.id === e.target.id).colorName);
        } else {
            this.props.onChange(this.props.name, this.props.options.find(el => el.id === e.target.id).name);
        }
        this.props.onBlur(this.props.name, true);
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        const { options, value, error, addDays, placeholder, className } = this.props;
        const { isOpenDropdown } = this.state;
        console.log(value);
        return (
            <div className="dropdown">
                <div className="dropbtn" style={{ border: error ? '1px solid red' : null }} onClick={this.openDropdown}>
                    {addDays && value ? (
                        <div className="timeoff-modal__list-item-left">
                            <div
                                className="timeoff-modal__list-item-color"
                                style={{
                                    background: `${options.find(el => el.colorName === value) &&
                                        options.find(el => el.colorName === value).color}`,
                                }}
                            />
                            <p className="timeoff-modal__list-item-text">{value}</p>
                        </div>
                    ) : (
                        <p style={{ color: !value ? '#BCBCBC' : null }}>{value || placeholder}</p>
                    )}
                    <i className={isOpenDropdown ? 'arrow-up' : 'arrow-down'} />
                </div>
                {/* {error ? <small style={{ color: 'red' }}>{error}</small> : null} */}
                <div className={isOpenDropdown ? 'dropdown-content__show' : 'dropdown-content__hidden'}>
                    {options.map(
                        el =>
                            addDays ? (
                                <div
                                    key={el.id}
                                    id={el.id}
                                    onClick={this.change}
                                    className="timeoff-modal__list-item-left"
                                >
                                    <div
                                        id={el.id}
                                        className="timeoff-modal__list-item-color"
                                        style={{ background: `${el.color}` }}
                                    />
                                    <p id={el.id} className="timeoff-modal__list-item-text">
                                        {el.colorName}
                                    </p>
                                </div>
                            ) : (
                                <div key={el.id} id={el.id} onClick={this.change}>
                                    {el.name}
                                </div>
                            )
                    )}
                </div>
            </div>
        );
    }
}

export default CustomSelect;
