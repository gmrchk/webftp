class Cache {
    constructor() {
        this.structures = {};
        this.lastLastVisited = {};

        this.addStructure('__local__');

        let fromLocalStorage = window.localStorage.getItem("cacheList");
        if(fromLocalStorage) {
            this.structures = JSON.parse(fromLocalStorage);
        }

        let lastVisitsFromLocalStorage = window.localStorage.getItem("cacheLastVisits");
        if(lastVisitsFromLocalStorage) {
            this.lastLastVisited = JSON.parse(lastVisitsFromLocalStorage);
        }
    }

    addStructure(name) {
        this.structures[name] = {};
    }

    cacheFolder(name, content, structure) {
        this.structures[structure][name] = content;
        window.localStorage.setItem("cache", JSON.stringify(this.structures));
        //console.log("Cache updated:", this.structures)
    }

    getFolder(name, structure) {
        if (this.structures[structure] == null) {
            this.addStructure(structure);
        }
        if(this.structures[structure][name] != null) {
            return this.structures[structure][name];
        }
        return [];
    }

    cacheLocalFolder(name, content) {
        this.cacheFolder(name, content, '__local__');
    }

    getLocalFolder(name) {
        return this.getFolder(name, '__local__');
    }

    updateLastVisitedFolder(folder, remote, name = '__local__') {
        if(this.lastLastVisited[name] == null) {
            this.lastLastVisited[name] = {};
        }
        this.lastLastVisited[name][remote ? "remote" : "local"] = folder;
        window.localStorage.setItem("cacheLastVisits", JSON.stringify(this.lastLastVisited));
    }

    getLastVisitedFolder(name = '__local__') {
        if(this.lastLastVisited[name] != null) {
            return this.lastLastVisited[name];
        }
        return {
            local: "/",
            remote: "/",
        };
    }
}

export default Cache;