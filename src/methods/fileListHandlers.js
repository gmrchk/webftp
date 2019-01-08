import { fs, ftp, cache } from '../App';

export function selectLocalFolder(path) {
    // get form cache first
    fs.goTo(path);
    let currentFolderState = {
        localFiles: cache.getLocalFolder(fs.currentFolder),
    };

    // save last visited
    cache.updateLastVisitedFolder(fs.currentFolder, false, ftp.currentRemote);

    this.setState({
        localCurrentFolder: String(fs.currentFolder),
        ...currentFolderState,
        status: "loading",
    });

    fs.readCurrentFolder().then((response) => {
        let currentFolderState = {
            localFiles: response.files,
        };

        cache.cacheLocalFolder(fs.currentFolder, response.files);

        if (fs.currentFolder === response.folder) {
            this.setState({
                localCurrentFolder: String(fs.currentFolder),
                ...currentFolderState,
                status: this.state.status === "transfer" ? "transfer" : "idle",
            });
        }
    });
}

export function selectRemoteFolder(path) {
    // get form cache first
    ftp.goTo(path);
    let currentFolderState = {
        remoteFiles: cache.getFolder(ftp.currentFolder, ftp.currentRemote),
    }

    this.setState({
        ...currentFolderState,
        remoteCurrentFolder: String(ftp.currentFolder),
        status: "loading",
    });

    // save last visited
    cache.updateLastVisitedFolder(ftp.currentFolder, true, ftp.currentRemote);

    ftp.readCurrentFolder().then((response) => {
        let currentFolderState = {
            remoteFiles: response.files,
        }

        cache.cacheFolder(response.folder, response.files, ftp.currentRemote);

        if (ftp.currentFolder === response.folder) {
            this.setState({
                ...currentFolderState,
                status: this.state.status === "transfer" ? "transfer" : "idle",
                log: [ ...this.state.log, {type: "", text: `Folder '${response.folder}' listed`, id: Math.random()} ]
            });
        }
    }, res => {
        this.log(res);
    });
}

export function switchFocus(event) {
    if(event.target.parentNode.parentNode.dataset.name === "local") {
        //let focus = this.refs.remote.state.active[0] ? this.refs.remote.state.active[0] : this.refs.remote.refs.back;
        let focus = this.refs.remote.refs.back;
        this.refs.remote.setState({
            ...this.refs.remote.state,
            active: [ '../' ]
        });
        focus.focus();
    } else { // remote
        //let focus = this.refs.local.state.active[0] ? this.refs.local.state.active[0] : this.refs.local.refs.back;
        let focus = this.refs.local.refs.back;
        this.refs.local.setState({
            ...this.refs.local.state,
            active: [ '../' ]
        });
        focus.focus();
    }
}