
class Queue {
    constructor() {
        this.list = [];
    }

    push(item) {
        this.list.push(item);
    }

    getCurrentList() {
        return this.list;
    }
}

export default Queue;