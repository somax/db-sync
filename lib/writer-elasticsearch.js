/**
 * ElasticSearch Writer
 */

const axios = require('axios')

const ES_URI = process.env.ES_URI || 'http://localhost:9200/test'
const ES_BASIC_AUTH = process.env.ES_BASIC_AUTH || ''

let headers = {
    'Authorization': 'Basic ' + ES_BASIC_AUTH,
    'Content-Type': 'application/json'
}

// 发送到 ES
async function post2es(data) {
    let {from, to, count} = data
    console.log('ESWRITER - [INFO] sending... ',{ from, to, count})

    let body = ''
    await data.data.forEach(_d => {
        let _id = _d._id
        delete _d._id
        body += `${JSON.stringify({ index: { "_id": _id } })}\n${JSON.stringify(_d)}\n`
    })

    let options = {
        method: 'POST',
        headers,
        url: ES_URI + '/_bulk',
        data: body
    }

    await axios(options)
        .then(function (res) {
            console.log('ESWRITER - [INFO]', {success: !res.data.errors })
            return true
        })
        .catch(function (error) {
            console.log('ESWRITER - [ERROR]', error.toString())
            // return false
            process.exit(1)
        })

}

module.exports = post2es