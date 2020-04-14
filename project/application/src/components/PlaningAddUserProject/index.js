import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Scrollbars } from 'react-custom-scrollbars';
import './style.scss';
import { connect } from 'react-redux';

class AddUserProject extends React.Component {
    state = {
        searchFlag: true,
        dataSelected: [],
        dataFiltered: [],
        dataEtalon: [],
        peopleArray: [],
        projectsArray: [],
    };

    componentDidMount() {
        const { selectedUsers } = this.props;
        this.setState({
            peopleArray: this.props.users,
            projectsArray: this.props.projects,
            dataFiltered: this.props.users,
            dataEtalon: this.props.users,
            dataSelected: selectedUsers,
        });
    }

    clearSearch() {
        this.smallSelectClientInputRef.value = '';
        this.findItem(this.state.dataEtalon);
    }

    findItem(items, searchText = '') {
        const { searchFlag } = this.state;
        const searchField = searchFlag ? 'username' : 'name';
        if (searchText.length > 0) {
            searchText = searchText.toLowerCase();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it[searchField]);
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

    selectItem(e, item) {
        const { checked } = e.target;

        if (checked) {
            this.setState(prevState => ({
                dataSelected: prevState.dataSelected.concat(item),
            }));
        } else {
            this.setState(prevState => ({
                dataSelected: prevState.dataSelected.filter(i => i.id !== item.id),
            }));
        }
    }

    setFlagTrue = () => {
        const { searchFlag, peopleArray } = this.state;
        const { selectedUsers } = this.props;

        this.setState({ searchFlag: true });
        if (!searchFlag) {
            this.setState({
                dataEtalon: peopleArray,
                dataFiltered: peopleArray,
                dataSelected: selectedUsers,
            });
            this.smallSelectClientInputRef.value = '';
        }
    };
    setFlagFalse = () => {
        const { searchFlag, projectsArray } = this.state;

        this.setState({ searchFlag: false });
        if (searchFlag) {
            this.setState({
                dataEtalon: projectsArray,
                dataFiltered: projectsArray,
                dataSelected: [],
            });
            this.smallSelectClientInputRef.value = '';
        }
    };

    close = e => {
        e.stopPropagation();
        this.props.cancel();
    };

    handleAddButton = e => {
        const { dataSelected, searchFlag } = this.state;

        this.props.onAddPress(dataSelected, searchFlag);
        this.close(e);
    };

    render() {
        const { vocabulary } = this.props;
        const { v_cancel_small, v_add, v_find, v_people, v_projects } = vocabulary;
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
                            placeholder={`${v_find}...`} //TODO probably change to search text
                            autoFocus
                        />
                        <i onClick={_ => this.clearSearch()} />
                    </div>

                    <div className="add-user-modal__body-list">
                        <Scrollbars
                            renderTrackHorizontal={props => (
                                <div {...props} style={{ display: 'none' }} className="track-horizontal" />
                            )}
                        >
                            {dataFiltered.map(item => (
                                <div className="add-user-modal__list-item-container" key={item.id}>
                                    <label className="add-user-modal__list-item-label">
                                        <Checkbox
                                            color={'primary'}
                                            value={item.name}
                                            checked={!!dataSelected.find(el => el.id === item.id)}
                                            onChange={e => {
                                                this.selectItem(e, item);
                                            }}
                                        />
                                        {item.name || item.username}
                                    </label>
                                </div>
                            ))}
                        </Scrollbars>
                    </div>
                </div>
                <div className="add-user-modal__footer">
                    <button className="add-user-modal__add-btn" onClick={this.handleAddButton}>
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

const mapStateToProps = ({ planingReducer }) => ({
    selectedUsers: planingReducer.selectedUsers,
});

export default connect(mapStateToProps)(AddUserProject);
