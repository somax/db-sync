/**
 * 同步 mongodb 数据到 elasticsearch 
 * by mxj @20191217
 * 
 * 将 mongodb 中的 id 同步到 es 中, 通过队列异步发送
 */
const post2es = require('./lib/writer-elasticsearch')
const mongoReader = require('./lib/reader-mongo')
const queue = require('./lib/queue')

queue.addConsumer(post2es)

mongoReader(queue.produce)

process.on('SIGINT', function() {
    process.exit();
});