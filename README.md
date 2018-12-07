## indexdb-api

indexedDB with simple api(all promised), make it easy to use

[![Build Status](https://travis-ci.org/Hokkaidosunny/indexdb-api.svg?branch=master)](https://travis-ci.org/Hokkaidosunny/indexdb-api)
[![Coverage Status](https://coveralls.io/repos/github/Hokkaidosunny/indexdb-api/badge.svg?branch=master)](https://coveralls.io/github/Hokkaidosunny/indexdb-api?branch=master)

## Install

```
yarn add indexdb-api
```

## Usage：

[see more example in `test/*.js`](https://github.com/Hokkaidosunny/indexdb-api/tree/master/test)

## DB

- DBs
- openDB
- closeDB
- getDB
- deleteDB

## Store

- getStore
- createStore
- getStoreCount
- deleteStore
- clearStore

## Data

- getAllData
- getDataByIndex
- getRangeDataByPrimaryKey
- addOneData
- putOneData
- deleteDataByPrimaKey

### DBs

db pool, cache all opened db

```
import { DBs } from 'index-api'

const db = DBs['myDB']
```

### `openDB(dbName: string, version?: number)`

create or open a db

```
import { openDB } from 'index-api'

openDB('myDB').then(db => {

})
```

### `closeDB(dbName: string)`

close a db

### `getDB(dbName: string)`

get a db

### `deleteDB(dbName: string)`

delete a db

### `getStore(dbName: string, storeName: string)`

get a store

### `createStore(dbName: string, storeName: string, options?: any, version?: number)`

creat a store

```javascript
import { createStore } from 'index-api'

createStore('myDB', 'users', {
  keyOptions: {
    keyPath: 'id',
    autoIncrement: false
  },
  indexes: [
    {
      indexName: 'idIndex',
      indexKey: 'id',
      indexOptions: { unqiue: false, mulitEntry: false }
    },
    {
      indexName: 'nameIndex',
      indexKey: 'name',
      indexOptions: { unqiue: false, mulitEntry: false }
    }
  ]
})
```

### `getStoreCount(dbName: string, storeName: string)`

get all data count in a store

### `deleteStore(dbName: string, storeName: string)`

delete a store

### `clearStore(dbName: string, storeName: string)`

clear all data in a store

### `getAllData(dbName: string, storeName: string)`

get all data in a store

```javascript
import { getAllData } from 'index-api'

getAllData('myDB', 'users').then(allData => {})
```

### `getDataByIndex(dbName: string, storeName: string, indexName: string, value: any)`

get a data by index setted before

```javascript
import { getDataByIndex, createStore } from 'index-api'

// assume we have tom in store
var tom = {
  id: 1,
  name: 'Tom',
  age: 26
}

// and create store with id index
createStore('myDB', 'users', {
  keyOptions: {
    keyPath: 'id', // primary key
    autoIncrement: false
  },
  indexes: [
    {
      indexName: 'idIndex',
      indexKey: 'id',
      indexOptions: { unqiue: false, mulitEntry: false }
    }
  ]
})

// how we get tom
getDataByIndex('myDB', 'users', 'idIndex', 1).then(data => {
  expect(data.name).equal('Tom')
})
```

### `getRangeDataByPrimaryKey(dbName: string, storeName: string, start: number, end: number)`

```javascript
import { getRangeDataByPrimaryKey } from 'index-api'

// assume we have this store
// id is the primary key
var store = [
  {
    id: 1,
    name: 'Tom',
    age: 26
  },
  {
    id: 2,
    name: 'Xx',
    age: 26
  }
]

getRangeDataByPrimaryKey('myDB', 'users', 1, 2).then(allData => {
  // allData === store
})
```

### `addOneData(dbName: string, storeName: string, data: any)`

insert a data

### `putOneData(dbName: string, storeName: string, data: any)`

update a data

### `deleteDataByPrimaKey(dbName: string, storeName: string, primaryKeyValue: any)`

delete a data by primary key
