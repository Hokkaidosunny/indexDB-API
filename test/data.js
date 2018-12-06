describe('data.js', function() {
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

  describe('getAllData(dbName, storeName) : get all data from store users in db abc', function() {
    it('should return array', function() {
      return IndexDB.getAllData('abc', 'users').then(function(allData) {
        console.log(allData)
        expect(getType.call(allData)).equal('[object Array]')
      })
    })
  })

  describe('addOneData(dbName, storeName, data) : add one data to store users in db abc', function() {
    it('should return store count', function() {
      var data = {
        id: 1,
        name: 'Tom',
        age: 25
      }
      return IndexDB.addOneData('abc', 'users', data).then(function(count) {
        expect(typeof count).equal('number')
      })
    })
  })

  describe('putOneData(dbName, storeName, data) : update one data to store users in db abc', function() {
    it('should return store count', function() {
      var data = {
        id: 1,
        name: 'Tom',
        age: 26
      }
      return IndexDB.putOneData('abc', 'users', data).then(function(count) {
        expect(typeof count).equal('number')
      })
    })
  })

  describe("getDataByIndex(dbName, storeName, 'id', 1) : get data by index", function() {
    it("should return an object within a 'name' property, and the value is 'Tom'", function() {
      return IndexDB.getDataByIndex('abc', 'users', 'idIndex', 1).then(function(
        data
      ) {
        console.log(data)
        expect(data.name).equal('Tom')
      })
    })
  })

  describe('getRangeDataByPrimaryKey(dbName, storeName, start, end) : get data by Range', function() {
    it('should return an array', function() {
      return IndexDB.getRangeDataByPrimaryKey('abc', 'users', 1, 2).then(
        function(allData) {
          console.log(allData)
          expect(getType.call(allData)).equal('[object Array]')
          expect(allData.length).equal(1)
        }
      )
    })
  })

  describe('deleteDataByPrimaKey(dbName, storeName, primaryKeyValue) : delete data by primaryKeyValue', function() {
    it('should return bool', function() {
      return IndexDB.deleteDataByPrimaKey('abc', 'users', 1).then(function(
        bool
      ) {
        expect(typeof bool).equal('boolean')
      })
    })
  })

  describe("deleteStore('abc', 'users')", function() {
    it("should delete store 'users' and return db 'abc'", function() {
      return IndexDB.deleteStore('abc', 'users').then(function(db) {
        expect(db instanceof IDBDatabase).equal(true)
        expect(db.name).equal('abc')
      })
    })
  })
})
