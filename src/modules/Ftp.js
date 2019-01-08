const path = require('path');
const jsftp = window.require("jsftp");
//const net = window.require("net");

class Ftp {
    constructor() {
        this.currentFolder = "./";
        this.connection = null;
        this.currentRemote = null;
        this.connections = {};
    }

    isDomainOrIp(host) {
        let r = RegExp('^http[s]?:\/\/((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])');
        if(r.test(host) || /^[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,}$/i.test(host)) {
            return null;
        } else {
            return {text: "Wrong host format.", type: "error"};
        }
    }

    connect(credentials) {
        return new Promise((resolve, reject) => {
            let error;
            error = this.isDomainOrIp(credentials.host);
            if (!error) {
                let connection = new jsftp({host: credentials.host});
                connection.auth(credentials.user, credentials.pass, (err, res) => {
                    if (err) {
                        reject({text: `Wrong credentials`, type: "warning"});
                    }

                    this.createConnection(credentials);
                    resolve({text: `Connected to ${credentials.host}`, type: "info"});
                });
            } else {
                reject(error);
            }
        });
    }

    createConnection(credentials) {
        this.connection = createConnection();
        this.connectionForFileChecker = createConnection();

        this.connections[credentials.id] = {
            connection: this.connection,
            connection: this.connectionForFileChecker,
        };

        function createConnection() {
            return new jsftp({
                host: credentials.host,
                port: credentials.port, // defaults to 21
                user: credentials.user, // defaults to "anonymous"
                pass: credentials.pass, // defaults to "@anonymous"
                ssl: true,
            });
        }

        this.currentRemote = credentials.id;
    }

    goTo(folder) {
        if(folder != null) {
            this.currentFolder = path.resolve(this.currentFolder, folder);
        }

        return true;
    }

    readCurrentFolder() {
        let id = 0;
        let currentFolderFiles = [];
        let folder = String(this.currentFolder);

        if(!this.connection) {
            return new Promise((resolve, reject) => reject("No active connection connect first"));
        }

        return new Promise((resolve, reject) => {
            this.connection.ls(this.currentFolder, (err, files) => {
                if(err) {
                    reject({
                        text: String(err),
                        type: "error",
                    });
                } else if (files) {
                    files.forEach(file => {
                        let filePath = path.join(this.currentFolder, file.name);

                        let fileInfo = {
                            id: id,
                            name: file.name,
                            path: filePath,
                            size: file.size,
                            type: file.type === 1 ? "folder" : "file",
                            extension: path.extname(file)
                        };

                        currentFolderFiles.push(fileInfo);
                        id++;
                    });

                    resolve({ files: currentFolderFiles, folder });
                }
            });
        });
    }

    getFileInfo(file) {
        return new Promise((resolve, reject) => {
            this.connectionForFileChecker.raw(`SIZE ${file}`, (err, res) => {
                if (err) {
                    reject({
                        text: err,
                        type: "error",
                    });
                } else {
                    let size = parseInt(res.text.split(' ')[1]);

                    let fileInfo = {
                        name: path.basename(file),
                        path: file,
                        size: size,
                        type: "file",
                        extension: path.extname(file),
                    };

                    resolve(fileInfo);
                }
            });
        });
    }

    transfer(file) {
        if(file.upload) {
            return this.transferUp(file);
        } else {
            return this.transferDown(file);
        }
    }

    transferUp(file) {
        return new Promise((resolve, reject) => {
            this.connection.put(path.join(file.fromFolder, file.name), path.join(file.toFolder, file.name), (err, res) => {
                if (err) {
                    reject({
                        text: err,
                        type: "error",
                    });
                } else {
                    resolve(res);
                }
            });
        });
    }

    transferDown(file) {
        return new Promise((resolve, reject) => {
            this.connection.get(path.join(file.fromFolder, file.name), path.join(file.toFolder, file.name), (err, res) => {
                if (err) {
                    reject({
                        text: err,
                        type: "error",
                    });
                } else {
                    resolve(res);
                }
            });
        });
    }
}

export default Ftp;