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
IndexDB.createDB(dbName, version).then(function(db){
  //db
});
```
> * dbName: string
> * version: number, optional ,default to be `new Date().getTime()`

#### open a existed db

```javascript
IndexDB.openDB(dbName, version).then(function(db){
  //db
});
```

> * dbName: string
> * version: number, optional ,default to be `new Date().getTime()`

### Object Store

#### create a new store

```javascript
/* example
var opts = {
  dbName: 'abc',
  storeName: 'users',
  keyOptions: {
    keyPath:'id',//主键
    autoIncrement: false,//是否自增长
  },
  index: [  //索引项
    {indexName: 'stu_id', indexKey: 'id',indexOptions: {unqiue: false, mulitEntry: false}},
    {indexName: 'stu_name', indexKey: 'name', indexOptions: {unqiue: false, mulitEntry: false}},
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
var store = IndexDB.getStore(db, storeName);
```

> * db: IDBDatabase instance
> * storeName: String

#### get data count in a store

```javascript
IndexDB.getStoreCount(db, storeName).then(function(count){
  //count
});
```

> * db: IDBDatabase instance
> * storeName: String

#### clear data

```javascript
IndexDB.clearStore(store);
```

> * store: IDBObjectStore instance

#### delete store

```javascript
IndexDB.deleteStore(db, storeName);
```

> * db: IDBDatabase instance
> * storeName: String

### Data

#### get all data in a store

```javascript
IndexDB.getAllData(store).then(function(dataArr){
  //dataArr:<Array>
});
```

> * store: IDBObjectStore instance

#### get data by index



> ….to be continue