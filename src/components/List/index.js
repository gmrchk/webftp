import React, { Component } from 'react';
import sharedIcon from '../../icons/shared.svg';
import search from '../../icons/search.svg';
import Empty from '../Empty/index';

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {searched: ""};
        this.count = 0;
    }

    handleSearch(event) {
        this.setState({searched: event.target.value});
    }

    submitHandler(event){
        let found = false;
        if(event.keyCode === 13 && event.target.value !== ""){
            this.props.list.some(item => {
                if(this.state.searched === "" || item.name.toLowerCase().startsWith(this.state.searched)) {
                    this.props.handleEnter(item.id);
                    found = true;
                    return true;
                }
                return false;
            });

            if(found) {
                this.setState({searched: ""});
            }
        }
        if(event.keyCode === 27) {
            this.setState({searched: ""});
        }
    }

    compare(a,b) {
        if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        return 0;
    }

    render() {
        let className = "List";
        if(this.state.searched !== "") {
            className += " is-searching";
        }

        this.count = 0;

        // sort list alphabetically
        let list = this.props.list;
        if(list.length) {
            list.sort(this.compare);
        }

        return (
            <div className={className}>
                <div className="ListSearch">
                    <input placeholder="Search..." id="searchbar" value={this.state.searched} onChange={this.handleSearch.bind(this)} onKeyDown={this.submitHandler.bind(this)}/>
                    <img src={search} alt=""/>
                </div>
                <div className="ListContainer">
                    {list.map(item => {

                        // list item class
                        let className = "ListItem";
                        if(item[this.props.activeName]) {
                            className += " is-active";
                        }

                        // shared by
                        let sharedBy = `Shared with you <br> by ${item.owner}`;

                        if(this.state.searched === "" || item.name.toLowerCase().startsWith(this.state.searched)) {
                            this.count++;

                            return (
                                <div key={item.name} data-id={item.id} className={className} tabIndex="0" role="button" onClick={this.props.handleListItemClick}>
                                    <div className="ListItem-name">{item.name}</div>
                                    {item.type === 'shared' ? <div className="ListItem-icon" data-tip={sharedBy} data-effect="solid" data-multiline={true}><img src={sharedIcon} alt=""/></div> : ""}
                                </div>
                            )
                        } else {
                            return null;
                        }
                    })}
                    {(this.state.searched == "" || "add".toLowerCase().startsWith(this.state.searched)) && this.props.add &&
                        <div data-id="__add__" className="ListItem ListItem--add" tabIndex="0" role="button" onClick={this.props.handleListItemClick}>
                            <div className="ListItem-name"><span>+</span></div>
                        </div>
                    }
                    {!this.count && (<Empty/>)}
                </div>
            </div>
        );
    }
}
