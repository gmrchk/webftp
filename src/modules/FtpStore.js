
class FtpStore {
    constructor() {
        this.list = {};

        let fromLocalStorage = window.localStorage.getItem("ftpList");
        if(fromLocalStorage) {
           this.list = JSON.parse(fromLocalStorage);
        }
    }

    get(id) {
        return this.list[id];
    }

    getNewUid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }

    set(data) {
        Object.keys(this.list).forEach(key => {
            this.list[key].boardActive = false;
        });

        if(data.id === -1) {
            let uid = this.getNewUid();

            this.list[uid] = {
                id: uid,
                name: data.name,
                host: data.host,
                user: data.user,
                pass: data.pass,
                port: data.port || 21,
                type: data.type,
                owner: data.owner,
                active: false,
                boardActive: true,
                ssl: data.ssl || true,
            };

            this.saveToLocalStorage();
            return uid;
        } else {
            if(this.list[data.id]) {
                let preservePassword = this.list[data.id].pass;

                this.list[data.id] = {
                    ...this.list[data.id],
                    ...data,
                    boardActive: true,
                }

                if(data.pass === "" || data.pass === null || data.pass === "•••••••") {
                    this.list[data.id].pass = preservePassword;
                }
            } else {
                this.list[data.id] = {
                    id: data.id,
                    name: data.name,
                    host: data.host,
                    user: data.user,
                    pass: data.pass,
                    port: data.port || 21,
                    type: data.type,
                    owner: data.owner,
                    active: false,
                    boardActive: false,
                    ssl: data.ssl || true,
                };
            }
            this.saveToLocalStorage();
            return data.id;
        }
    }

    getList() {
        let limitedList = {};

        Object.keys(this.list).forEach(key => {
            limitedList[key] = {
                id: this.list[key].id,
                name: this.list[key].name,
                active: this.list[key].active,
                boardActive: this.list[key].boardActive,
                type: this.list[key].type,
                owner: this.list[key].owner,
                host: this.list[key].host,
                user: this.list[key].user,
            };
        });

        return limitedList;
    }

    getTemplate() {
        return {
            id: -1,
            name: "",
            host: "",
            user: "",
            pass: "",
            port: 21,
            type: null,
            owner: "You",
            active: false,
            boardActive: false,
            ssl: true,
        };
    }

    delete(id) {
        if(this.list[id]) {
            delete this.list[id];
        }

        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        window.localStorage.setItem("ftpList", JSON.stringify(this.list));
    }
}

export default FtpStore;