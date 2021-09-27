class UserInput {
    constructor(inputLocator, buttonLocator) {
        log(`init UserInput('${inputLocator}')`)
        this.storageKey = 'userTyped'
        this.input = Q(inputLocator)
        this.button = Q(buttonLocator)
        this._initSubmitEventListener()
        this._initStorage()
    }

    _runCallback() {
        const v = this.value
        log("用户提交了哦，jio 妹妹！", v)

        for (const cb of this.submitCallbacks) {
            cb(v)
        }
        // inherent callbac
        // clean
        this.input.value = ''
        localStorage.removeItem(this.storageKey)

    }
    _initSubmitEventListener () {
        this.submitCallbacks = []
        // 
        this.input.addEventListener('keyup', event => {
            if (event.code !== 'Enter') {
                return
            }
            if (this.isEmpty) {
                return
            }
            this._runCallback()
        })
        this.button.addEventListener('click', event =>{
            if (this.isEmpty) {
                return
            }
            this._runCallback()
        })
    }

    // highlevel event
    onSubmit(callback) {
        this.submitCallbacks.push(callback)
    }
    _initStorage() {
        const k = this.storageKey
        // init input value from localstorage
        this.input.value = localStorage.getItem(k)

        // localstore when user type
        this.input.addEventListener('keyup', event => {
            if (this.isEmpty) {
                localStorage.removeItem(k)
                return
            }
            localStorage.setItem(k, this.value)
        })

    }
    get value () {
        return this.input.value.trim()  
    }

    set value (value) {
        this.input.value = value
        // localStorage.getItem(this.storageKey)
    }

    get isEmpty () {
        return this.value.length === 0
    }
}
        
class Todo {
    constructor(content) {
        const t = getTimeStamp()
        this.id = `todo-${t}`
        this.content = content
        this.created_time = t
        this.isImportant = false
        this.isDone = false
    }
}


const app = Q('#app')
const input = new UserInput('#app > input', '#app > button')
const todolist = Q('#todolist')
const clearBtn = Q('#clearAll')

const renderTodos = () => {
    // 每次渲染前清空 Dom
    todolist.innerHTML = ''
    for(const todo of todos){
        const li = createElement(todolist, 'li', '', {'data-id': todo.id})
        createElement(li, 'input', '', {'type':'checkbox'})
        const span = createElement(li, 'span', todo.content)
        // vanilla js
        const deleteBtn = createElement(li, 'button', 'delete')
    }
}

const initTodoData = () => {
    // 读 localStorage
    // observe todo data
    const d = localStorage.getItem("todoData")
    let todos = JSON.parse(d)
    
    return observe(todos, 
        () => {
        log("todos 的长度发生了改变, 重新 rende")
        renderTodos()
        }, 
        () => {
        localStorage.setItem("todoData", JSON.stringify(todos))
    })
}

const todos = initTodoData()
renderTodos()

input.onSubmit(content => {
    const todo = new Todo(content)
    todos.push(todo)
})

const deleteTodo = (id) =>{
    [index, todo] = findTodoById(id)
    todos.splice(index, 1)
}

const findTodoById = (id)=>{
    let index = -1
    for(const [i, todo] of todos.entries()){
        if(todo.id === id){
            index = i
            return [i, todo]
        }
    }
    if (index === -1) {
        log("not found")
        return [-1, null]
    }
}

const changeTodoState = (id) => {
    [index, todo] = findTodoById(id)
    log(index)
    todos[index].isDone = !todos[index].isDone
    // todo.isDone = !todo.isDone
}

todolist.addEventListener('click', event => {
    log(event, event.target)
    const t = event.target
    const id = t.parentElement.dataset.id
    log('li id is', id)
    if(t.nodeName === 'BUTTON'){
        log('detele todo')
        deleteTodo(id)
    }
    if(t.nodeName === 'INPUT'){
        log('change state')
        changeTodoState(id)
    }
})

clearBtn.addEventListener('click', event => {
    log('clearAll Btn clicked')
    todos.splice(0, todos.length)
})

