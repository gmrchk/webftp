import React, { Component } from 'react';
import Empty from '../Empty/index';
import file from '../../icons/file.svg';
import folderBlue from '../../icons/folder-blue.svg';
import back from '../../icons/back.svg';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

//const path = require('path');

export default class Files extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: [],
        };

        this.searchTimeout = null;
        this.searchTerm = "";

        this.list = this.props.files;
    }

    componentDidMount() {
        // reset scroll
        this.refs.files.scrollTop = 0;
        this.refs.back.focus();
        this.previousFolder = String(this.props.currentFolder);
    }

    componentDidUpdate() {
        // reset scroll
        if(this.previousFolder !== this.props.currentFolder) {
            this.setState({
                active: ["../"]
            });
            this.refs.back.focus();
        }

        this.previousFolder = this.props.currentFolder;
    }

    compareFilesTypes(a,b) {
        if (a.type === b.type)
            return 0;
        if (a.type === "folder" && b.type !== "folder")
            return -1;
        if (a.type !== "folder" && b.type === "folder")
            return 1;
    }

    compare(a,b) {
        if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        return 0;
    }

    selectAllHandler(event) {
        event.preventDefault();
        if (window.getSelection && window.getSelection().toString() === "") {
            let range = document.createRange();
            range.selectNode(event.target);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    keysHandler(event) {
        event.preventDefault();
        if(event.metaKey && event.keyCode === 65) {
            event.target.focus();
            this.setState({
                active: [ ...this.list.map(item => item.path) ]
            });
        }
        if(event.keyCode === 38) {
            // up
            if(!event.metaKey) {
                if (event.target.previousSibling) {
                    event.target.previousSibling.focus();
                    this.setState({
                        active: event.shiftKey ? [...this.state.active, event.target.previousSibling.dataset.path] : [event.target.previousSibling.dataset.path]
                    });
                } else {
                    event.target.focus();
                    this.setState({
                        active: event.shiftKey ? [...this.state.active, event.target.dataset.path] : [event.target.dataset.path]
                    });
                }
            } else {
                event.target.parentNode.firstChild.focus();
                this.setState({
                    active: [event.target.parentNode.firstChild.dataset.path]
                });
            }
        } else if(event.keyCode === 40) {
            // down
            if(!event.metaKey) {
                if (event.target.nextSibling) {
                    event.target.nextSibling.focus();
                    this.setState({
                        active: event.shiftKey ? [...this.state.active, event.target.nextSibling.dataset.path] : [event.target.nextSibling.dataset.path]
                    });
                } else {
                    event.target.focus();
                    this.setState({
                        active: event.shiftKey ? [...this.state.active, event.target.dataset.path] : [event.target.dataset.path]
                    });
                }
            } else {
                event.target.parentNode.lastChild.focus();
                this.setState({
                    active: [event.target.parentNode.lastChild.dataset.path]
                });
            }
        } else if(event.keyCode === 13) {
            // upload
            if(event.target.dataset.type === "folder" || event.target.dataset.type === "back") {
                this.props.goTo(event.target.dataset.path);
            } else {
                this.state.active.forEach(item => {
                    this.props.addToQueue(item, this.props.direction);
                });
            }
        } else if(event.keyCode === 37 || event.keyCode === 39) {
            // switch panel focus
            this.props.switchFocus(event);
        } else {
            // search
            this.searchTerm += String.fromCharCode(event.keyCode).toLowerCase();

            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.searchTerm = "";
            }, 1000);

            this.list.some(item => {
                if(item.name.toLowerCase().startsWith(this.searchTerm)) {
                    this.setState({
                        active: [ item.path ],
                    });
                    this.refs[item.name].focus();
                    return true;
                }
            });
        }
    }

    clickHandler(event) {
        let active;
        if(!event.shiftKey) {
            if(!event.metaKey) {
                // if no control key, empty active files
                active = [];
            } else {
                // copy active
                active = [ ...this.state.active ];
            }

            // add clicked item to active
            if(!active.includes(event.currentTarget.dataset.path)) {
                active.push(event.currentTarget.dataset.path);
            } else {
                let index = active.indexOf(event.currentTarget.dataset.path);
                active.splice(index, 1);
            }
        } else {
            active = [];
            let inRange = false;
            let currentActiveElementPath = this.state.active[0];

            Object.keys(this.refs).forEach(key => {
                if(this.refs[key].dataset.path === currentActiveElementPath || this.refs[key] === event.currentTarget) {
                    inRange = !inRange;
                }
                if(inRange || this.refs[key] === event.target || this.refs[key].dataset.path === currentActiveElementPath && !active.includes(this.refs[key].dataset.path)) {
                    active.push(this.refs[key].dataset.path);
                }
            });
        }

        this.setState({
            active: active,
        });
    }

    doubleClickHandler(event) {
        if(event.currentTarget.dataset.type === "folder" || event.currentTarget.dataset.type === "back") {
            this.props.goTo(event.currentTarget.dataset.path);
        } else {
            this.state.active.forEach(item => {
                this.props.addToQueue(item, this.props.direction);
            });
        }
    }

    contextAddToQueueHandler(event) {
        if(event.target.dataset.type === "folder" || event.target.dataset.type === "back") {
            this.props.goTo(event.target.dataset.path);
        } else {
            this.state.active.forEach(item => {
                this.props.addToQueue(item, this.props.direction);
            });
        }
    }

    render() {
        //console.log(this.state)

        // sort list alphabetically and by type
        this.list = this.props.files;
        this.list.sort(this.compare);
        this.list.sort(this.compareFilesTypes);

        return (
            <div className={"Files Files--" + this.props.name} ref="files" data-name={this.props.name}>
                <div className="FilesHeader" onClick={this.selectAllHandler.bind(this)}>
                    {this.props.currentFolder}
                </div>
                <div ref="container" className="FilesContainer" tabIndex="0" onKeyDown={this.keysHandler.bind(this)}>
                    <div ref="back" data-path={"../"} className={this.state.active.includes('../') ? "FilesItem FilesItem--back FilesItem--active" : "FilesItem FilesItem--back"} data-id="back" data-type="back" tabIndex="0" role="button" onDoubleClick={this.doubleClickHandler.bind(this)}>
                        <div className="FilesItem-inner">
                            <div className="FilesItem-icon"><img src={back} alt=""/></div>
                            <div className="FilesItem-name">..</div>
                        </div>
                    </div>
                    {this.list.map(item => {
                        let icon = item.type === "folder" ? folderBlue : file;
                        let className = item.type === "folder" ? "FilesItem FilesItem--folder" : "FilesItem FilesItem--file";
                        if(item.extension === null || item.extension === "")  {
                            className += " FilesItem--noExtension";
                        }
                        if(this.state.active.includes(item.path))  {
                            className += " FilesItem--active";
                        }
                        return (
                            <div ref={item.name} key={item.name} data-name={item.name} data-path={item.path} className={className} data-id={item.id} data-type={item.type} tabIndex="0" role="button" onClick={this.clickHandler.bind(this)} onDoubleClick={this.doubleClickHandler.bind(this)}>
                                <ContextMenuTrigger key={item.name} id="fileContentMenu">
                                    <div className="FilesItem-inner">
                                        <div className="FilesItem-icon">
                                            <img src={icon} alt=""/>
                                            {item.extension && <span className="FilesItem-iconName">{item.extension}</span>}
                                        </div>
                                        <div className="FilesItem-name" title={item.name}>{item.name}</div>
                                    </div>
                                </ContextMenuTrigger>
                            </div>
                        )
                    })}
                    <ContextMenu id="fileContentMenu">
                        <MenuItem onClick={this.contextAddToQueueHandler.bind(this)}>
                            Add to queue
                        </MenuItem>
                    </ContextMenu>
                    {!this.props.files.length && (<Empty/>)}
                </div>
            </div>
        );
    }
}
