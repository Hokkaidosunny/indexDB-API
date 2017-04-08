var expect = chai.expect;
mocha.ui('bdd');

describe('store.js', function(){
  //clear dbs
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

  describe('createStore(options)', function() {
    it('should create store named \'users\'and return it', function() {
      var options = {
        dbName: 'abc',
        storeName: 'users',
        keyOptions: {
          keyPath: 'id', //主键
          autoIncrement: false //是否自增长
        },
        index: [  //索引项
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

      return IndexDB.createStore(options).then(function(store){
        expect(store instanceof IDBObjectStore).equal(true);
        expect(store.name).equal('users');
      });
    });
  });

  describe('getStore(\'abc\', \'users\')', function(){
    it('should return store', function() {
      return IndexDB.getStore('abc', 'users').then(function(store) {
        expect(store instanceof IDBObjectStore).equal(true);
        expect(store.name).equal('users');
      });
    });
  });

  describe('getStoreCount(\'abc\', \'users\')', function(){
    it('should return store count', function(){
      return IndexDB.getStoreCount('abc', 'users').then(function(count) {
        expect(typeof count).equal('number');
      });
    })
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
