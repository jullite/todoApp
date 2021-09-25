
const Q = document.querySelector.bind(document)
const log = console.log.bind(console);

const createElement = (parent, tagName, text="", attributes={}) => {
    const e = document.createElement(tagName)
    if (text){
        e.innerText = text
    }
    for (const [key, value] of Object.entries(attributes)) {
        e.setAttribute(key, value)
    }
    parent.insertAdjacentElement('beforeend', e)
    return e
}

const getTimeStamp = () => Date.now()

const observe = (arr, prop, callback) => {
    const handler = {
        set: function(target, property, value, receiver) {
            // 执行所有原来的行为
            const result = Reflect.set(...arguments)


            // 笔记 todo
            // push 会 set 两次哦
            // 一次是 arr 的 len；一次是 arr[index] = value
            // log("set it", target, property, value, receiver) 
            
            if (prop === property) {
                callback()
            }

            return result
        }
    }
    
    return new Proxy(arr, handler)
}
