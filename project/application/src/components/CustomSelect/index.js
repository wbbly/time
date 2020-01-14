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
        this.props.onChange(this.props.name, this.props.options.find(el => el.id === e.target.id).name);
        this.props.onBlur(this.props.name, true);
    };

    render() {
        const { options, value, error } = this.props;
        const { isOpenDropdown } = this.state;
        return (
            <div className="dropdown">
                <div className="dropbtn" style={{ border: error ? '1px solid red' : null }} onClick={this.openDropdown}>
                    <p>{value}</p>
                    <i className={isOpenDropdown ? 'arrow-up' : 'arrow-down'} />
                </div>
                {error ? <small style={{ color: 'red' }}>{error}</small> : null}
                <div className={isOpenDropdown ? 'dropdown-content__show' : 'dropdown-content__hidden'}>
                    {options.map(el => (
                        <div key={el.id} id={el.id} onClick={this.change}>
                            {el.name}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default CustomSelect;
