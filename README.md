# db-sync

数据同步工具, 用于同步 mongodb 数据到 elasticsearch 中

> 本项目任然在开发过程中

## usage

### 环境变量
```
MONGO_URI = mongodb://localhost:27017
MONGO_DB_NAME = test
MONGO_COLLECTION_NAME = test
SYNC_FROM = 0
SYNC_STEP_SIZE = 100
SYNC_WAIT_TIME = 2000

SYNC_TIME_FIELD = timestamp
SYNC_TIME_FROM = 2019-11-21T00:00:00.000+08:00
SYNC_TIME_TO = 

ES_URI = http://localhost:9200/test
ES_BASIC_AUTH = 
```
> `SYNC_TIME_FROM` 及 `SYNC_TIME_TO` 是用标准ISO时间格式, 不支持数字时间戳, `SYNC_TIME_TO` 留空表示不断同步最新的

### 运行
```
node .
```

### Docker
```
docker run --rm --name db-sync -it \
    -e MONGO_URI='mongodb://localhost:27017' \
    -e MONGO_DB_NAME='test' \
    -e MONGO_COLLECTION_NAME='test' \
    -e SYNC_FROM=0 \
    -e SYNC_STEP_SIZE=100 \
    -e SYNC_WAIT_TIME=2000 \
    -e ES_URI='http://localhost:9200/test' \
    -e ES_BASIC_AUTH='' \
    -e SYNC_TIME_FIELD='timestamp' \
    -e SYNC_TIME_FROM='2019-11-21T00:00:00.000+08:00' \
    -e SYNC_TIME_TO='' \
    dbsync
```