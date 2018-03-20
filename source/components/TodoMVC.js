import { GluonElement } from '../node_modules/gluonjs/gluon.js';
import { onRouteChange } from '../node_modules/gluon-router/gluon-router.js';
import { html, render } from '../node_modules/lit-html/lib/lit-extended.js';
import { repeat } from '../node_modules/lit-html/lib/repeat.js';
import { TodoList } from './TodoList.js';

const _list = new TodoList();

class TodoMVC extends GluonElement {
    constructor() {
        super();
        // if the route changes show/hide elements
        onRouteChange((path, query, hash) => {
            this.showHide(hash.substr(1))
        })
    }

    showHide(sState) {
        // grab lists of elements
        var allElements = this.shadowRoot.querySelectorAll('ul.todo-list li'),
            completedElements = this.shadowRoot.querySelectorAll('ul.todo-list li.completed'),
            activeElements = this.shadowRoot.querySelectorAll('ul.todo-list li:not(.completed)');
        // unhide all elements
        for(let element in allElements) {
            if(allElements.hasOwnProperty(element)) {
                allElements[element].classList.remove("hidden");
            }
        }

        switch(sState) {
            case "completed":
                // viewing completed elements, hide active
                for(let element in activeElements) { 
                    if(activeElements.hasOwnProperty(element)) {
                        activeElements[element].classList.add("hidden");
                    }
                }
                break;
            case "active":
                // viewing active elements, hide completed
                for(let element in completedElements) {
                    if(completedElements.hasOwnProperty(element)) {
                        completedElements[element].classList.add("hidden");
                    }
                }
                break;
        }
    }

    get style() {
        return html`
            <style>
                @import url('../node_modules/todomvc-common/base.css');
                @import url('../node_modules/todomvc-app-css/index.css');
            </style>
        `;
    }

    get header() {
        return html`
            <header class="header">
                <h1>todos</h1>
                ${this.input}
            </header>
        `;
    }
    
    get input() {
        return html `
            <input
                id="newTodo"
                class="new-todo"
                placeholder="what needs to be done?"
                autofocus
                on-blur=${(eEvent) => {
                    if(this.$.newTodo.value.length > 0) {
                        _list.addItem(this.$.newTodo.value);
                        render(this.template, this.parentElement);
                        // something wierd happens in render, the second time you do this the parentElement is null
                        // also using queryselector and a wrapper in html, body directly...
                        // feels like it cloned the dom but keeps running functions in a disconnected class
                    }
                }}
                on-keypress=${(eEvent) => {
                    if(eEvent.keyCode === 13) {
                        _list.addItem(this.$.newTodo.value);
                        this.$.newTodo.value = ""; // otherwise blur event duplicates todo
                        render(this.template, this.parentElement);
                    }
                }}
            >
        `;
    }

    get main() {
        return html`
            <section class="main">
                <input type="checkbox" class="toggle-all">
                <label for="toggle-all">Mark all as complete</label>
                <ul class="todo-list">
                ${repeat(
                    _list.items,
                    item => item.title,
                    item => html`
                        <li class$=${item.completed ? 'completed' : ''}>
                            <div class="view">
                                <input 
                                    class="toggle"
                                    type="checkbox"
                                    checked="${item.completed}"
                                    on-click=${() => {
                                        item.toggleComplete();
                                        _list.save();
                                        render(this.template, this.parentElement);
                                    }}
                                >
                                <label>${item.title}</label>
                                <button
                                    class="destroy"
                                    on-click=${() => {
                                        _list.deleteItem(item);
                                        render(this.template, this.parentElement);
                                    }}
                                ></button>
                            </div>
                        </li>
                    `
                )}
                </ul>
            </section>
        `;
    }
    
    get footer() {
        return html`
            <footer class="footer" hidden="${!_list.items.length}">
                <span class="todo-count">${_list.items.length} items left</span>
                <ul class="filters">
                    <li><a href="#/" class="selected">All</a></li>
                    <li><a href="#/active">Active</a></li>
                    <li><a href="#/completed">Completed</a></li>
                </ul>
                <button class="clear-completed" style="display: none;">Clear completed</button>
            </footer>
        `;
    }

    get template() {
        return html `
            ${this.style}
            <div class="todoapp">
                ${this.header}
                ${this.main}
                ${this.footer}
            </div>
        `;
    }
}

customElements.define(TodoMVC.is, TodoMVC);