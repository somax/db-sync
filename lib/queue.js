/**
 * 异步队列
 */

// 计数
let count = 1
// 队列缓存
let queue = []
const MAX_QUEUE_SIZE = 1000
let isConsuming = false


// 添加
function produce(data) {
    let queueSize = queue.length
    console.log('QUEUE - [INFO]',{queueSize});
    if (queueSize > MAX_QUEUE_SIZE) {
        throw new Error(`queue size (${queueSize}) >  MAX_QUEUE_SIZE (${MAX_QUEUE_SIZE})`)
    }
    count++

    // 将数据推入队列
    queue.unshift(data)

    // 检查如果消费停止状态则触发
    console.debug('QUEUE - [DEBUG]',{ isConsuming })
    if (!isConsuming) {
        consume()
    }
}

// 如果队列中有数据,则通过递归的方式不断消费, 否则停止
async function consume() {
    // 设置消费标识
    isConsuming = true

    if (queue.length > 0) {
        // 开始消费
        let _data = queue.pop()
        await consumer(_data)
        await consume()
    } else {
        isConsuming = false
    }
}

let consumer = function(){}

function addConsumer(cb){
    consumer = cb
}

function getCount(){
    return count
}

module.exports = {
    produce,
    addConsumer,
    getCount
}