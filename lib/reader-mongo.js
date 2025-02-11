/**
 * MongoDB Reader
 */

const mongodb = require('mongodb')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017'
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'test'
const MONGO_COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'test'
const SYNC_FROM = parseInt(process.env.SYNC_FROM) || 0
const SYNC_STEP_SIZE = parseInt(process.env.SYNC_STEP_SIZE) || 100
const SYNC_WAIT_TIME = parseInt(process.env.SYNC_WAIT_TIME) || 2000
const SYNC_TIME_FIELD = process.env.SYNC_TIME_FIELD || 'timestamp'
const SYNC_TIME_FROM = process.env.SYNC_TIME_FROM || '2019-11-21T00:00:00.000+08:00'
const SYNC_TIME_TO = process.env.SYNC_TIME_TO || undefined

let SyncTimeFrom = new Date(SYNC_TIME_FROM)
let LastSyncTime = SyncTimeFrom
let LastCount = 0

function init(cb) {
    mongodb.connect(MONGO_URI, (err, client) => {

        if (err) return

        let collection = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME)

        let skip = SYNC_FROM
        let limit = SYNC_STEP_SIZE

        // 获取数据
        async function find(_skip, _limit) {
            console.log('MONGOREADER - [INFO] finding... ', { SyncTimeFrom, _skip, _limit })
            let _filter = {}
            _filter[SYNC_TIME_FIELD] = { $gte: new Date(SyncTimeFrom), $lt: SYNC_TIME_TO ? new Date(SYNC_TIME_TO) : new Date() }
            let _sort = {}
            _sort[SYNC_TIME_FIELD] = 1

            let data = await collection.find(_filter)
                .sort(_sort)
                .skip(_skip)
                .limit(_limit)
                .toArray()
            let count = data.length

            console.log({count});
            let postData = {
                from: _skip + 1,
                to: _skip + count,
                count,
                data: data
            }

            if (count > 0) {
                LastSyncTime = data[data.length - 1][SYNC_TIME_FIELD]

                try {
                    cb(postData)
                } catch (error) {
                    console.log(error);
                    process.exit(1)
                }

                skip += count
                find(skip, limit)

                
            }else{
                SyncTimeFrom = LastSyncTime
                skip = 0
                setTimeout(() => {
                    find(skip, limit)
                }, SYNC_WAIT_TIME)               
            }
            LastCount = count

        }

        // 启动
        find(skip, limit)
    })
}

module.exports = init