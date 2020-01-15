import React from 'react';

import _ from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';
import { Scrollbars } from 'react-custom-scrollbars';
import './style.scss';

export class AddUserProject extends React.Component {
    state = {
        searchFlag: true,
        dataSelected: [],
        dataFiltered: [],
        dataEtalon: [],
        peopleArray: [],
        projectsArray: [],
    };

    componentDidMount() {
        this.setState({
            peopleArray: this.props.users,
            projectsArray: this.props.projects,
            dataFiltered: this.props.users,
            dataEtalon: this.props.users,
        });
    }

    clearSearch() {
        this.smallSelectClientInputRef.value = '';
        this.findItem(this.state.dataEtalon);
    }

    findItem(items, searchText = '') {
        if (searchText.length > 0) {
            searchText = searchText.toLowerCase();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it.name);
                return values
                    .join()
                    .toLowerCase()
                    .indexOf(searchText) > -1
                    ? it
                    : undefined;
            });
            this.setState({ dataFiltered: filteredArr });
        } else {
            this.setState({ dataFiltered: items });
        }
    }

    selectItem(item) {
        let newArr = this.state.dataSelected.slice();
        newArr.find(el => el.id === item.id) ? newArr.splice(newArr.indexOf(item), 1) : newArr.push(item);
        this.setState({ dataSelected: newArr });
    }

    // selectAll() {
    //     this.setState({ dataSelected: this.state.dataEtalon });
    // }

    // selectNone() {
    //     this.setState({ dataSelected: [] });
    // }

    setFlagTrue = () => {
        this.setState({ searchFlag: true });
        if (!this.state.searchFlag) {
            this.setState({
                dataEtalon: this.state.peopleArray,
                dataFiltered: this.state.peopleArray,
                dataSelected: [],
            });
            this.smallSelectClientInputRef.value = '';
        }
    };
    setFlagFalse = () => {
        this.setState({ searchFlag: false });
        if (this.state.searchFlag) {
            this.setState({
                dataEtalon: this.state.projectsArray,
                dataFiltered: this.state.projectsArray,
                dataSelected: [],
            });
            this.smallSelectClientInputRef.value = '';
        }
    };

    close = e => {
        e.stopPropagation();
        this.props.cancel();
    };

    render() {
        const { add, vocabulary } = this.props;
        const { v_cancel_small, v_add, v_find, v_select_all, v_select_none, v_people, v_projects } = vocabulary;
        const { searchFlag, dataSelected, dataFiltered, dataEtalon } = this.state;
        return (
            <div className="add-user-modal">
                <div className="add-user-modal__header">
                    <button
                        style={searchFlag ? { borderBottom: '1px solid #000000', color: '#000000' } : null}
                        onClick={this.setFlagTrue}
                    >
                        {v_people}
                    </button>
                    <button
                        style={!searchFlag ? { borderBottom: '1px solid #000000', color: '#000000' } : null}
                        onClick={this.setFlagFalse}
                    >
                        {v_projects}
                    </button>
                </div>
                <div className="add-user-modal__body">
                    <div className="add-user-modal__body-search">
                        <input
                            type="text"
                            onKeyUp={_ => this.findItem(dataEtalon, this.smallSelectClientInputRef.value)}
                            ref={input => (this.smallSelectClientInputRef = input)}
                            placeholder={`${v_find}...`}
                            autoFocus
                        />
                        {/* <div  onClick={_ => this.selectAll()}>
                            {v_select_all}
                        </div>
                        <div  onClick={_ => this.selectNone()}>
                            {v_select_none}
                        </div> */}
                        <i onClick={_ => this.clearSearch()} />
                    </div>

                    <div className="add-user-modal__body-list">
                        <Scrollbars>
                            {dataFiltered.map(item => (
                                <div className="add-user-modal__list-item-container" key={item.id}>
                                    <label className="add-user-modal__list-item-label">
                                        {item.name}
                                        <Checkbox
                                            color={'primary'}
                                            value={item.name}
                                            checked={!!dataSelected.find(el => el.id === item.id)}
                                            onChange={_ => {
                                                this.selectItem(item);
                                            }}
                                        />
                                    </label>
                                </div>
                            ))}
                        </Scrollbars>
                    </div>
                </div>
                <div className="add-user-modal__footer">
                    <button
                        className="add-user-modal__add-btn"
                        onClick={e => add(JSON.stringify(this.state.dataSelected.map(el => el.name)))}
                    >
                        {v_add}
                    </button>
                    <button className="add-user-modal__cancel-btn" onClick={this.close}>
                        {v_cancel_small}
                    </button>
                </div>
            </div>
        );
    }
}
