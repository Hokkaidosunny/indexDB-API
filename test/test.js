mocha.ui('bdd');
mocha.timeout(600000);

var expect = chai.expect;

var dbNames,
    myDB,
    users_store,
    allData;

describe('getDBNames', function() {
  it('should return an array', function(done) {
    IndexDB.getDBNames().then(function(names){
      dbNames = names;
      expect(typeof dbNames).equal('array');
      done();
    }).catch(function(err){
      expect(err instanceof Error).equal(true);
      done();
    });
  });
});

describe('createDB', function() {
  it('should return the db', function(done) {
    IndexDB.createDB('abc').then(function(db){
      expect(db instanceof IDBDatabase).equal(true);
      done();
    }).catch(function(err){
      expect(err instanceof Error).equal(true);
      done();
    });
  });
});

describe('openDB, getStore', function() {
  it('should return db and store', function(done) {
    IndexDB.openDB('abc').then(function(db){
      myDB = db;
      expect(db instanceof IDBDatabase).equal(true);

      users_store = IndexDB.getStore(myDB, 'users');
      expect(users_store instanceof IDBObjectStore).equal(true);

      done();
    }).catch(function(err){
      expect(err instanceof Error).equal(true);
      done();
    });
  });
});



/*
describe('createStore', function() {
  describe('create store "users" in db "abc"', function() {
    it('should return the store "users"', function(done) {
      IndexDB.createStore({
        dbName: 'abc',
        storeName: 'users',
        keyOptions: {
          keyPath: 'id', //主键
          autoIncrement: false //是否自增长
        },
        index: [  //索引项
          { indexName: 'stu_id', indexKey: 'id', indexOptions: { unqiue: false, mulitEntry: false } },
          { indexName: 'stu_name', indexKey: 'name', indexOptions: { unqiue: false, mulitEntry: false } }
        ]
      }).then(function(store){
        expect(store instanceof IDBDatabase).equal(true);
        done();
      }).catch(function(err){
        expect(err instanceof Error).equal(true);
        done();
      });
    });
  });
});

describe('getStore', function() {
  describe('get store "users" in db "abc"', function() {
    it('should return the store "users"', function(done) {
      IndexDB.openDB('abc').then(function(db){
        var store_users = IndexDB.getStore(db, 'users');
        expect(store_users instanceof IDBObjectStore).equal(true);
        done();
      }).catch(function(err){
        expect(err instanceof Error).equal(true);
        done();
      });
    });
  });
});


describe('getStoreCount', function() {
  describe('get store "users" data count in db "abc"', function() {
    it('should return the store "users" data count', function(done) {
      IndexDB.openDB('abc').then(function(db){
        return IndexDB.getStoreCount(db, 'users');
      }).then(function(count){
        expect(typeof count).equal('number');
        done();
      }).catch(function(err){
        expect(err instanceof Error).equal(true);
        done();
      });
    });
  });
});*/
