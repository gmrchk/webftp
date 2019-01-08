import { fs, ftp, queueStore } from '../App';

const path = require('path');

export function addToQueue(path, direction) {
    if(!ftp.currentRemote) {
        this.log({
            text: 'You must connect to remote server to place files into queue.',
            type: 'warning',
        });
        return;
    }

    if(queueStore.list.filter(item => item.path === path).length) {
        this.log({
            text: `Item '${path}' is already in the queue`,
            type: 'warning',
        });
        return;
    }

    let template = {
        priority: 1,
        progress: 0,
        fromFolder: "",
        toFolder: "",
        remote: String(ftp.currentRemote),
        inProgress: false,
    };

    if(direction === ">") {
        template.fromFolder = String(this.state.localCurrentFolder);
        template.toFolder = String(this.state.remoteCurrentFolder);
        template.upload = true;

        fs.getFileInfo(path).then((response) => {
            let file = {
                ...template,
                ...response,
            };

            queueStore.push(file);

            let list = queueStore.getCurrentList();

            this.setState({
                queue: [...list],
            });

            if(this.state.queueStatus !== "paused") {
                this.processQueue();
            }
        });
    } else if(direction === "<") {
        template.fromFolder = this.state.remoteCurrentFolder;
        template.toFolder = this.state.localCurrentFolder;
        template.upload = false;

        ftp.getFileInfo(path).then((response) => {
            let file = {
                ...template,
                ...response,
            };

            queueStore.push(file);

            let list = queueStore.getCurrentList();

            this.setState({
                queue: [...list],
            });

            if(this.state.queueStatus !== "paused") {
                this.processQueue();
            }
        });
    }
}

export function processQueue() {
    if(queueStore.list.length > 0) {
        if(this.state.status !== "transfer") {
            let list = [...queueStore.getCurrentList()];
            list[0].inProgress = true;

            this.setState({
                status: "transfer",
                queue: list,
            });

            // for getting % of uploaded
            let loop = setInterval(() => {
                if (queueStore.list[0]) {
                    if (queueStore.list[0].upload) {
                        // upload
                        ftp.getFileInfo(path.join(queueStore.list[0].toFolder, queueStore.list[0].name)).then(file => {
                            let list = [...queueStore.getCurrentList()];

                            if (queueStore.list[0]) {
                                let totalSize = queueStore.list[0].size;

                                let fileSize = file.size;
                                let progress = fileSize / totalSize;

                                list[0].progress = !isNaN(progress) ? progress : 0;
                                list[0].transfered = fileSize;

                                this.setState({
                                    queue: list,
                                    log: [...this.state.log, {text: `File ${file.name} uploaded`, type: "info"}],
                                });
                            }
                        });
                    } else {
                        // donwload
                        fs.getFileInfo(path.join(queueStore.list[0].toFolder, queueStore.list[0].name)).then(file => {
                            let list = [...queueStore.getCurrentList()];

                            if (queueStore.list[0]) {
                                let totalSize = queueStore.list[0].size;

                                let fileSize = file.size;
                                let progress = fileSize / totalSize;

                                list[0].progress = !isNaN(progress) ? progress : 0;
                                list[0].transfered = fileSize;

                                this.setState({
                                    queue: list,
                                    log: [...this.state.log, {text: `File ${file.name} transfered`, type: "info"}],
                                });
                            }
                        });
                    }
                }
            }, queueStore.list[0].upload ? 1000 : 100);

            ftp.transfer(queueStore.list[0]).then(response => {
                clearInterval(loop);

                let upload = queueStore.list[0].upload;

                queueStore.list.splice(0, 1);

                let list = queueStore.getCurrentList();

                this.setState({
                    status: "idle",
                    queue: [...list],
                });

                if (upload) {
                    this.selectRemoteFolder();
                } else {
                    this.selectLocalFolder();
                }

                this.processQueue();
            });
        }
    } else {
        // switch to pause
        //this.toggleQueueStatus();
    }
}

export function toggleQueueStatus() {
    this.setState({
        queueStatus: this.state.queueStatus === "paused" ? "played" : "paused",
    });
    if (this.state.queueStatus === "played") {
        this.processQueue();
    }
}