
const Q = document.querySelector.bind(document)
const log = console.log.bind(console);
const setS = (key, value) => {
    localStorage.setItem(key, value)
}
const getS = (key) => {
    return localStorage.getItem(key)
}
const rmS = (key) => {
    localStorage.removeItem(key)
}

const createElement = (parent, tagName, text = "", attributes = {}) => {
    const e = document.createElement(tagName)
    if (text) {
        e.innerText = text
    }
    for (const [key, value] of Object.entries(attributes)) {
        e.setAttribute(key, value)
    }
    parent.insertAdjacentElement('beforeend', e)
    return e
}

const getTimeStamp = () => Date.now()

const observe = (arr, callback) => {
    const handler = () =>
    ({
        get: function (target, prop) {
            log("Get %s, type is %s", prop, Object.prototype.toString.call(target[prop]))
            if (['[object Object]'].indexOf(Object.prototype.toString.call(target[prop])) > -1) {
                return new Proxy(target[prop], handler());
            }
            return target[prop]
        },

        set: function (target, property, value) {
            // 执行所有原来的行为
            const result = Reflect.set(...arguments)
            // target[property] = value
            // 笔记 todo
            // push 会 set 两次哦
            // 一次是 arr 的 len；一次是 arr[index] = value
            log("Set %s to %o", property, value);

            // 如果长度改变，重新渲染
            // if (property === 'length') {
            callback()
            // }
            //存储
            return result
        }
    })


    return new Proxy(arr, handler())
}
