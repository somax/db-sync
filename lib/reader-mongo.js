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

function init(cb) {
    mongodb.connect(MONGO_URI, (err, client) => {

        if(err) return

        let col_wgh = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME)

        let skip = SYNC_FROM
        let limit = SYNC_STEP_SIZE

        // 获取数据
        async function find(_skip, _limit) {
            console.log('MONGOREADER - [INFO] finding... ', { _skip, _limit })
            let data = await col_wgh.find().skip(_skip).limit(_limit).toArray()
            let count = data.length

            let postData = {
                from: _skip + 1,
                to: _skip + count,
                count,
                data: data
            }

            if (count > 0) {
                try {
                    cb(postData)
                    find(skip += count, limit)
                } catch (error) {
                    console.log(error);
                    process.exit(1)
                }
                

            } else {
                console.log('MONGOREADER - [INFO] no data find, wait...', SYNC_WAIT_TIME);
                setTimeout(() => {
                    // console.log('MONGOREADER - [INFO] Continue...');
                    // console.log({ skip, limit });
                    find(skip, limit)
                }, SYNC_WAIT_TIME)
            }

        }

        // 启动
        find(skip, limit)
    })
}

module.exports = init