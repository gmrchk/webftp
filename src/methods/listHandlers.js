import { ftpStore, ftp, cache } from '../App';

export function handleSelectFtpItem(event) {
    this.selectFtpItem(event.currentTarget.dataset.id);
}

export function handleSelectToEditFtpItem(event) {
    this.editFtpItem(event.currentTarget.dataset.id);
}

export function editFtpItem(id) {
    if(id !== "__add__") {
        this.state.list.forEach(item => {
            if(item.id === id) {
                item.boardActive = true;
            } else {
                item.boardActive = false;
            }
            return item;
        });

        // credentials
        let credentials = ftpStore.get(id);
        this.setState({
            ///board: { ...credentials },
            currentBoard: credentials,
        });
    } else {
        this.state.list.forEach(item => {
            item.boardActive = false;
            return item;
        });

        // credentials
        let credentials = ftpStore.getTemplate();
        this.setState({
            currentBoard: credentials,
        });
    }
}

export function saveFtpItem(data) {
    let uid = ftpStore.set(data);

    let list = ftpStore.getList();
    let credentials = ftpStore.get(uid);

    this.setState({
        list: Object.keys(list).map(key => {
            return list[key];
        }),
        currentBoard: {
            ...credentials
        }
    });
}

export function deleteFtpItem(id) {
    ftpStore.delete(id);

    let list = ftpStore.getList();

    this.setState({
        list: Object.keys(list).map(key => {
            return list[key];
        }),
        currentBoard: {}
    });
}

export function selectFtpItem(id = ftp.currentRemote) {
    this.state.list.forEach(item => {
        if(item.id == id) {
            item.active = true;
        } else {
            item.active = false;
        }
        return item;
    });

    // credentials
    let credentials = ftpStore.get(id);

    this.setState({
        status: "loading",
        log: [ ...this.state.log, {type: "warning", text: `Connecting to '${credentials.name}'`, id: Math.random()} ]
    });

    ftp.connect(credentials).then(res => {
        this.setState({
            status: "loading",
            log: [ ...this.state.log, {type: "info", text: `Connected to '${credentials.name}'`, id: Math.random()} ]
        });
        this.selectLocalFolder(cache.getLastVisitedFolder(id).local);
        this.selectRemoteFolder(cache.getLastVisitedFolder(id).remote);
    }, res => {
        this.log(res);
    });
    //console.log(s);
    //fs.goTo(cache.getLastVisitedFolder(id).local);
    //ftp.goTo(cache.getLastVisitedFolder(id).remote);
}