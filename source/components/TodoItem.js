export class TodoItem {
    constructor(sTitle, bDone) {
        this.title = sTitle
        this.completed = bDone === true ? true : false;
    }

    setTitle(sTitle) {
        this.title = sTitle;
    }

    toggleComplete(foo) {// argument required but not used
        this.completed = !this.completed;
    }
}