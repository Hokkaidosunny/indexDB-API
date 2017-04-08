## Usage：

### DB

#### get all db names

```javascript
IndexDB.getDBNames().then(function(dbNames){
  //dbNames
});
```
#### create a new db

```javascript
/**
* dbName:[String]
* version:[Number], optional ,default to be new Date().getTime()
*/
IndexDB.createDB(dbName, version).then(function(db){
  //db
});
```
#### open a existed db

```javascript
/**
* dbName:[String]
* version:[Number], optional ,default to be new Date().getTime()
*/
IndexDB.openDB(dbName, version).then(function(db){
  //db
});
```

### Object Store

#### create a new store

```javascript
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
      indexOptions: {
        unqiue: false,
        mulitEntry: false
      }
    },
    {
      indexName: 'nameIndex',
      indexKey: 'name',
      indexOptions: {
        unqiue: false,
        mulitEntry: false
      }
    },
  ]
};
*/
var opts = {
  dbName: <String>,
  storeName: <String>,
  version: <Number, optional>,
  keyOptions: <Object, optional>,
  index: <Array, optional>
};

IndexDB.createStore(opts).then(function(store){
  //store
});
```

#### get store

```javascript
/**
* db:[IDBDatabase]
* storeName:[String]
*/
var store = IndexDB.getStore(db, storeName);
```

#### get data count in a store

```javascript
/**
* db:[IDBDatabase]
* storeName:[String]
*/
IndexDB.getStoreCount(db, storeName).then(function(count){
  //count
});
```

#### clear store

```javascript
/**
* store:[IDBObjectStore]
*/
IndexDB.clearStore(store);
```

#### delete store

```javascript
/**
* db:[IDBDatabase]
* storeName:[String]
*/
IndexDB.deleteStore(db, storeName);
```

### Data

#### get all data in a store

```javascript
/**
* store:[IDBObjectStore]
*/
IndexDB.getAllData(store).then(function(dataArr){
  //dataArr:<Array>
});
```

#### add one data

```javascript
/**
* store:[IDBObjectStore]
* data:[Object]
*/
var data = {
  id: 1,
  name: 'a'
};
IndexDB.addOneData(store, data).then(function(storeDataCount) {
  //storeDataCount
});
```

#### put one data

```javascript
/**
* store:[IDBObjectStore]
* data:[Object]
*/
var data = {
  id: 1,
  name: 'a'
};
IndexDB.putOneData(store, data).then(function(storeDataCount) {
  //storeDataCount
});
```

#### get data by index

```javascript
/**
* store:[IDBObjectStore]
* indexkey:[String]
* value:[any]
* example: IndexDB.getDataByIndex(store_users, 'id', 1);
*/
IndexDB.getDataByIndex(store, indexKey, value).then(function(data) {
  //data
});
```

#### get range data by primary key

```javascript
/**
* store:[IDBObjectStore]
* start:[Number]
* end:[Number]
* example: IndexDB.getRangeDataByPrimaryKey(store_users, 3, 6);
*/
IndexDB.getRangeDataByPrimaryKey(store, start, end).then(function(arr) {
  //arr
});
```

> ….to be continue
