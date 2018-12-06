## indexdb-api

[![Build Status](https://travis-ci.org/Hokkaidosunny/indexdb-api.svg?branch=master)](https://travis-ci.org/Hokkaidosunny/indexdb-api)
[![Coverage Status](https://coveralls.io/repos/github/Hokkaidosunny/indexdb-api/badge.svg?branch=master)](https://coveralls.io/github/Hokkaidosunny/indexdb-api?branch=master)

## Install

```
yarn add indexdb-api
```

## Usage：

[see more example in `test/*.js`](https://github.com/Hokkaidosunny/indexdb-api/tree/master/test)

### db.js

```javascript
/**
 * all the function retrun a promise
 */

/**
 * get all db names
 * return: [Array]
 */
IndexDB.getDBNames()

/**
 * create a db
 * dbName: [String]
 * version: [Number], optional ,default to be new Date().getTime()
 * return: [IDBDatabase] a db instance
 */
IndexDB.createDB(dbName, version)

/**
 * open an existed db
 * dbName: [String]
 * version: [Number], optional ,default to be new Date().getTime()
 * return: [IDBDatabase] a db instance
 */
IndexDB.openDB(dbName, version)
```

### store.js

```javascript
/**
 * create a store
 * opts = {
     dbName: <String>,
     storeName: <String>,
     version: <Number, optional>,
     keyOptions: <Object, optional>,
     index: <Array, optional>
   }
 */
IndexDB.createStore(opts)
/* example

var opts = {
  dbName: 'abc',
  storeName: 'users',
  keyOptions: {
    keyPath: 'id', //primary key
    autoIncrement: false, //auto increment
  },
  index: [  //index, use for query the data
    {
      indexName: 'idIndex',
      indexKey: 'id',
      indexOptions: { unqiue: false, mulitEntry: false }
    }, {
      indexName: 'nameIndex',
      indexKey: 'name',
      indexOptions: { unqiue: false, mulitEntry: false }
    }
  ]
};
IndexDB.createStore(opts).then(() => {
  console.log('success');
})

 */

/**
 * dbName: [String]
 * storeName: [String]
 * return: [IDBObjectStore] a store instance
 */
IndexDB.getStore(dbName, storeName)

/**
 * dbName: [String]
 * storeName: [String]
 * return: [Number] the count of the store data
 */
IndexDB.getStoreCount(dbName, storeName)

/**
 * clear the store data
 * store: [IDBObjectStore]
 */
IndexDB.clearStore(store)

/**
 * delete a store
 * dbName: [String]
 * storeName: [String]
 * version: [Number] , optional ,default to be new Date().getTime()
 */
IndexDB.deleteStore(dbName, storeName, version)
```

### Data.js

```javascript
/**
 * dbName: [string]
 * storeName: [string]
 * return: [Array] return all the data
 */
IndexDB.getAllData(dbName, storeName)

/**
 * add a data
 * dbName: [string]
 * storeName: [string]
 * data: [Object]
 * return: [Array] return all the data
 */
IndexDB.addOneData(dbName, storeName, data)
/* example

var data = {id: 1, name: 'Tom'};
IndexDB.addOneData('abc', 'users', data).then((count) => {
  console.log('saved! now the data count is ' + count);
})

*/

/**
 * update a data according to the primary key
 * dbName: [string]
 * storeName: [string]
 * data: [Object]
 * return: [Array] return all the data
 */
IndexDB.putOneData(dbName, storeName, data)

/**
 * get data by index
 * dbName: [string]
 * storeName: [string]
 * indexName: [string]
 * value: [any]
 */
IndexDB.getDataByIndex(dbName, storeName, indexName, value)
/* example
IndexDB.getDataByIndex('abc', 'users', 'idIndex', 1).then((data) => {
  console.log('the data is' + data);
});
*/

/**
 * get range data by primary key
 * dbName: [string]
 * storeName: [string]
 * start: [string]
 * end: [any]
 */
IndexDB.getRangeDataByPrimaryKey(dbName, storeName, start, end)
/* example
db: [
  {
    id: 1,  //primary key
    name: 'Tom',
    age: 20
  }, {
    id: 2,
    name: 'Jerry',
    age: 21
  }
]
IndexDB.getRangeDataByPrimaryKey('abc', 'users', 1, 2).then((dataArr) => {
  console.log('the data is' + dataArr);
});
*/
```

> ….to be continue
