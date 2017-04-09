describe('data.js', function(){
  // //clear dbs
  // describe('deleteDB(\'abc\')', function() {
  //   it('should return undefined', function() {
  //     return IndexDB.deleteDB('abc').then(function(res) {
  //       expect(res).equal(undefined);
  //     });
  //   });
  // });
  //
  // describe('createDB(\'abc\')', function() {
  //   it('should return a IDBDatabase instance named \'abc\'', function() {
  //     return IndexDB.createDB('abc').then(function(db) {
  //       expect(db instanceof IDBDatabase).equal(true);
  //       expect(db.name).equal('abc');
  //       return db;
  //     });
  //   });
  // });

  // describe('createStore(options)', function() {
  //   it('should create store named \'users\'and return it', function() {
  //     var options = {
  //       dbName: 'abc',
  //       storeName: 'users',
  //       keyOptions: {
  //         keyPath: 'id', //主键
  //         autoIncrement: false //是否自增长
  //       },
  //       index: [  //索引项
  //         {
  //           indexName: 'idIndex',
  //           indexKey: 'id',
  //           indexOptions: { unqiue: false, mulitEntry: false }
  //         }, {
  //           indexName: 'nameIndex',
  //           indexKey: 'name',
  //           indexOptions: { unqiue: false, mulitEntry: false }
  //         }
  //       ]
  //     };
  //
  //     return IndexDB.createStore(options).then(function(store){
  //       expect(store instanceof IDBObjectStore).equal(true);
  //       expect(store.name).equal('users');
  //     });
  //   });
  // });

  describe('getAllData(store) : get all data from store users in db abc', function(){
    it('should return array', function() {
      return IndexDB.getStore('abc', 'users').then(function(store) {
        expect(store instanceof IDBObjectStore).equal(true);
        expect(store.name).equal('users');

        return IndexDB.getAllData(store);
      }).then((allData) => {
        console.log(allData);
        expect(getType.call(allData)).equal('[object Array]');
      });
    });
  });


  describe('addOneData(store, data) : add one data to store users in db abc', function(){
    it('should return store count', function() {
      return IndexDB.getStore('abc', 'users').then(function(store) {
        expect(store instanceof IDBObjectStore).equal(true);
        expect(store.name).equal('users');

        var data = {
          id: 1,
          name: 'Tom',
          age: 25
        };
        return IndexDB.addOneData(store, data);
      }).then((count) => {
        expect(typeof count).equal('number');
      });
    });
  });

  describe('putOneData(store, data) : update one data to store users in db abc', function(){
    it('should return store count', function() {
      return IndexDB.getStore('abc', 'users').then(function(store) {
        expect(store instanceof IDBObjectStore).equal(true);
        expect(store.name).equal('users');

        var data = {
          id: 1,
          name: 'Tom',
          age: 26
        };
        return IndexDB.putOneData(store, data);
      }).then((count) => {
        expect(typeof count).equal('number');
      });
    });
  });

  describe('getDataByIndex(store, \'id\', 1) : get data by index', function(){
    it('should return an object within a \'name\' property, and the value is \'Tom\'', function() {
      return IndexDB.getStore('abc', 'users').then(function(store) {
        expect(store instanceof IDBObjectStore).equal(true);
        expect(store.name).equal('users');

        return IndexDB.getDataByIndex(store, 'idIndex', 1);
      }).then((data) => {
        console.log(data);
        expect(data.name).equal('Tom');
      });
    });
  });

  describe('getRangeDataByPrimaryKey(store, start, end) : get data by Range', function(){
    it('should return an array', function() {
      return IndexDB.getStore('abc', 'users').then(function(store) {
        expect(store instanceof IDBObjectStore).equal(true);
        expect(store.name).equal('users');

        var data = {
          id: 2,
          name: 'Tom',
          age: 27
        };
        IndexDB.putOneData(store, data);
        return store;
      }).then((store) => {
        return IndexDB.getRangeDataByPrimaryKey(store, 1, 2);
      }).then((allData) => {
        console.log(allData);
        expect(getType.call(allData)).equal('[object Array]');
        expect(allData.length).equal(2);
      });
    });
  });

  describe('deleteDataByPrimaKey(store, primaryKeyValue) : delete data by primaryKeyValue', function(){
    it('should return bool', function() {
      return IndexDB.getStore('abc', 'users').then(function(store) {
        expect(store instanceof IDBObjectStore).equal(true);
        expect(store.name).equal('users');

        return IndexDB.deleteDataByPrimaKey(store, 1);
      }).then((bool) => {
        expect(typeof bool).equal('boolean');
      });
    });
  });

  describe('deleteStore(\'abc\', \'users\')', function(){
    it('should delete store \'users\' and return db \'abc\'', function() {
      return IndexDB.deleteStore('abc', 'users').then(function(db) {
        expect(db instanceof IDBDatabase).equal(true);
        expect(db.name).equal('abc');
      });
    });
  });

});
