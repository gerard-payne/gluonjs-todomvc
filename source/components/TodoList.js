import { TodoItem } from './TodoItem.js';

export class TodoList {
    // on load iterate json in local storage and make new TodoItem
    constructor() {
        this.items = (function() {
            var _saved = JSON.parse(window.localStorage.getItem('TodoList')),
                _items = [];
            for(let item in _saved) {
                _items.push(new TodoItem(_saved[item].title, _saved[item].completed));
            }
            return _items;
        }());
    }

    save() {
        window.localStorage.setItem('TodoList', JSON.stringify(this.items));
    }

    addItem(sTodo) {
        this.items.push(new TodoItem(sTodo.trim()));
        this.save();
    }

    deleteItem(oTodoItem) {
        this.items = this.items.filter((oItem) => oItem !== oTodoItem);
        this.save();
    }
}