import React, { Component } from 'react';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import ReactTooltip from 'react-tooltip';

import Actions from './components/Actions/index';
import Board from './components/Board/index';
import Files from './components/Files/index';
import Menu from './components/Menu/index';
import Header from './components/Header/index';
import Panel from './components/Panel/index';
import List from './components/List/index';
import Log from './components/Log/index';
import Queue from './components/Queue/index';
import Status from './components/Status/index';
import Settings from './components/Settings/index';

import Fs from './modules/Fs';
import Ftp from './modules/Ftp';
import QueueStore from './modules/QueueStore';
import FtpStore from './modules/FtpStore';
import Cache from './modules/Cache';
import state from './debugState';

import { minimizeHandler, maximizeHandler, closeHandler, handleMenuItemClick, log } from './methods/windowHandlers';
import { handleSelectFtpItem, selectFtpItem, handleSelectToEditFtpItem, editFtpItem, saveFtpItem, deleteFtpItem } from './methods/listHandlers';
import { selectLocalFolder, selectRemoteFolder, switchFocus } from './methods/fileListHandlers';
import { addToQueue, processQueue, toggleQueueStatus } from './methods/queueHandlers';
import { saveSettings, getSettings } from './methods/settingsHandlers';

export const fs = new Fs();
export const ftp = new Ftp();
export const queueStore = new QueueStore();
export const ftpStore = new FtpStore();
export const cache = new Cache();

window.fs = fs;
window.ftp = ftp;
window.queueStore = queueStore;
window.ftpStore = ftpStore;
window.cache = cache;

class App extends Component {
    constructor(props) {
        super(props);
        // window handlers
        this.minimizeHandler = minimizeHandler;
        this.maximizeHandler = maximizeHandler;
        this.closeHandler = closeHandler;
        this.log = log;

        this.handleMenuItemClick = handleMenuItemClick;

        // ftp list handlers
        this.handleSelectFtpItem = handleSelectFtpItem;
        this.selectFtpItem = selectFtpItem;
        this.editFtpItem = editFtpItem;
        this.saveFtpItem = saveFtpItem;
        this.deleteFtpItem = deleteFtpItem;

        // file list handlers
        this.selectLocalFolder = selectLocalFolder;
        this.selectRemoteFolder = selectRemoteFolder;
        this.switchFocus = switchFocus;

        this.handleSelectToEditFtpItem = handleSelectToEditFtpItem;

        // queue handlers
        this.addToQueue = addToQueue;
        this.processQueue = processQueue;
        this.toggleQueueStatus = toggleQueueStatus;

        // settings handlers
        this.saveSettings = saveSettings;
        this.getSettings = getSettings;
        this.state = state;
    }

    componentDidMount() {
        // set settings
        let settings = this.getSettings();

        // get FTPs
        let list = ftpStore.getList();

        // get base folder
        this.selectLocalFolder();

        this.setState({
            list: Object.keys(list).map(key => {
                return list[key];
            }),
            settings: settings,
        });
    }

    render() {
        //console.log(this.state);

        let className = "App";
        className += this.state.settings.theme ? " theme-" + this.state.settings.theme : "";
        className += this.state.settings.animations ? " animations-" + this.state.settings.animations : "";

        return (
            <div className={className}>
                <div className="AppHeader">
                    <Header/>
                </div>
                <div className="AppContainer">
                    <div className="AppMenu">
                        <Menu handleMenuItemClick={this.handleMenuItemClick.bind(this)} activePanel={this.state.activePanel}/>
                        <Actions queueStatus={this.state.queueStatus} toggleQueueStatus={this.toggleQueueStatus.bind(this)}/>
                    </div>
                    {this.state.activePanel === "transfer" &&
                        <Panel name="transfer">
                            <List list={this.state.list} activeName="active" handleListItemClick={this.handleSelectFtpItem.bind(this)} handleEnter={this.selectFtpItem.bind(this)}/>
                            <Log log={this.state.log}/>
                            <Files ref="local" name="local" files={this.state.localFiles} direction=">" addToQueue={this.addToQueue.bind(this)} currentFolder={this.state.localCurrentFolder} goTo={this.selectLocalFolder.bind(this)} switchFocus={this.switchFocus.bind(this)} />
                            <Files ref="remote" name="remote" files={this.state.remoteFiles} direction="<" addToQueue={this.addToQueue.bind(this)} currentFolder={this.state.remoteCurrentFolder} goTo={this.selectRemoteFolder.bind(this)} switchFocus={this.switchFocus.bind(this)} />
                            <Queue queue={this.state.queue}/>
                        </Panel>
                    }
                    {this.state.activePanel === "edit" &&
                        <Panel name="edit">
                            <List list={this.state.list} activeName="boardActive" handleListItemClick={this.handleSelectToEditFtpItem.bind(this)} handleEnter={this.editFtpItem.bind(this)} add={true}/>
                            <Board board={this.state.currentBoard} saveHandler={this.saveFtpItem.bind(this)} deleteHandler={this.deleteFtpItem.bind(this)}/>
                        </Panel>
                    }
                    {this.state.activePanel === "settings" &&
                        <Panel name="settings">
                            <Settings settings={this.state.settings} saveHandler={this.saveSettings.bind(this)}/>
                        </Panel>
                    }
                </div>
                <div className="AppFooter">
                    <Status status={this.state.status}/>
                </div>
                <div className="AppAlert">
                    <Alert stack={{limit: 3}} />
                </div>
                <ReactTooltip />
            </div>
        );
    }
}

export default App;
