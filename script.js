import { saveTodosIntoLocalStorage, getTodosFromLocalStorage, getDateRepresentation } from "./utils.js";

const addTodoInput = document.querySelector('[data-add-todo-input]');
const addTodoBtn = document.querySelector('[data-add-todo-btn]');

const searchTodoInput = document.querySelector('[data-search-todo-input]');

const numberOfTodosSpan = document.querySelector('[data-number-of-todos-span]');
const clearCompletedTodosBtn = document.querySelector('[data-remove-completed-todos-btn]');

const todosContainer = document.querySelector('[data-todo-container]');
const todoTemplate = document.querySelector('[data-todo-template]');

const addForm = document.querySelector('#addForm');

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addNewTodo();
});


let todoList = getTodosFromLocalStorage();
let filteredTodoLists = [];

addTodoInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        addNewTodo();
    }
})

addTodoInput.addEventListener('input', () => {
    if (searchTodoInput.value.trim()){
        searchTodoInput.value = '';
        renderTodos();
    }
})

const addNewTodo = () => {
    if (addTodoInput.value.trim()) {
        const newTodo = {
            id: Date.now(),
            text: addTodoInput.value.trim(),
            completed: false,
            createdAt: getDateRepresentation(new Date()),
        }
        todoList.push(newTodo);
        addTodoInput.value = '';
        saveTodosIntoLocalStorage(todoList);
        renderTodos();
    }
}

const clearCompletedTodos = () => {
    todoList = todoList.filter((t) => {
        if(!t.completed){
            return t;
        }
    })

    saveTodosIntoLocalStorage(todoList);
    if(searchTodoInput.value.trim()){
        const currentSearchValue = searchTodoInput.value.trim();
        filterAndRenderFilteredTodos(currentSearchValue);
    } else{
        renderTodos();
    }

    
}

addTodoBtn.addEventListener('click', () => {addNewTodo();});

clearCompletedTodosBtn.addEventListener('click', () => {
    clearCompletedTodos();
})

const createTodoLayout = (todo) => {
    const todoElement = document.importNode(todoTemplate.content, true);

    const checkbox = todoElement.querySelector('[data-todo-checkbox]');
    checkbox.checked = todo.completed;

    const todoText = todoElement.querySelector('[data-todo-text]');
    todoText.textContent = todo.text;

    const todoCreatedDate = todoElement.querySelector('[data-todo-date]');
    todoCreatedDate.textContent = todo.createdAt;

    const removeTodoBtn = todoElement.querySelector('[data-remove-todo-btn]');
    removeTodoBtn.disabled = !todo.completed;

    checkbox.addEventListener('change', (e) => {
        todoList = todoList.map((t) => {
            if(t.id === todo.id) {
                t.completed = e.target.checked;
            }
            return t
        })
        saveTodosIntoLocalStorage(todoList);

        if(searchTodoInput.value.trim()){
            const currentSearchValue = searchTodoInput.value.trim();
            filterAndRenderFilteredTodos(currentSearchValue);
        } else{
            renderTodos();
        }
    })

    removeTodoBtn.addEventListener('click', () => {
        todoList = todoList.filter((t) => {
            if(t.id !== todo.id){
                return t;
            }
        })


        saveTodosIntoLocalStorage(todoList);

        if(searchTodoInput.value.trim()){
            const currentSearchValue = searchTodoInput.value.trim();
            filterAndRenderFilteredTodos(currentSearchValue);
        } else{
            renderTodos();
        }

    })

    return todoElement;
}

searchTodoInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.trim();
    filterAndRenderFilteredTodos(searchValue);
})

const renderFilteredTodo = () => {
    todosContainer.innerHTML = '';

    numberOfTodosSpan.innerHTML = `Number of todos: ${filteredTodoLists.length}`;

    if(filteredTodoLists.length === 0){
        todosContainer.innerHTML = `
        <h3> No todos found...</h3>`;
        return;
    }
    
    filteredTodoLists.forEach((todo) => {
        const todoElement = createTodoLayout(todo);
        todosContainer.append(todoElement);
    })

    
}

const filterAndRenderFilteredTodos = (searchValue) => {
    filteredTodoLists = todoList.filter((t) => {
        return t.text.includes(searchValue);
    })

    renderFilteredTodo();
}

const renderTodos = () => {
    todosContainer.innerHTML = '';

    numberOfTodosSpan.textContent = `Number of todos: ${todoList.length}`;

    if(todoList.length === 0){
        todosContainer.innerHTML = `
        <h3>No todos...</h3>`;
        return;
    }
    todoList.forEach((todo) => {
        const todoElement = createTodoLayout(todo);
        todosContainer.append(todoElement);
    })

}

renderTodos();