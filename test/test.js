mocha.ui('bdd');
mocha.timeout(10000);

var expect = chai.expect;

var myDB = new IndexDB();

describe('getDBNames', function() {
  describe('getDBNames function', function() {
    it('should return an array', function(done) {
      myDB.getDBNames().then(function(dbNames){
        expect(typeof dbNames).equal('array');
        done();
      }).catch(function(err){
        expect(err instanceof Error).equal(true);
        done();
      });
    });
  });
});

describe('createDB', function() {
  describe('create db "abc"', function() {
    it('should return the created db "abc"', function(done) {
      myDB.createDB('abc').then(function(db){
        expect(db instanceof IDBDatabase).equal(true);
        done();
      }).catch(function(err){
        expect(err instanceof Error).equal(true);
        done();
      });;
    });
  });
});

describe('openDB', function() {
  describe('openDB db "abc"', function() {
    it('should return the db "abc"', function(done) {
      myDB.openDB('abc').then(function(db){
        expect(db instanceof IDBDatabase).equal(true);
        done();
      }).catch(function(err){
        expect(err instanceof Error).equal(true);
        done();
      })
    });
  });
});

describe('createStore', function() {
  describe('create store "users" in db "abc"', function() {
    it('should return the store "users"', function(done) {
      myDB.createStore({
        dbName: 'abc',
        storeName:'users',
      	keyOptions:{
      		keyPath:'id',//主键
      		autoIncrement:false,//是否自增长
      	},
      	index:[  //索引项
      		{ indexName:'stu_id',indexKey:'id',indexOptions:{ unqiue:false,mulitEntry:false } },
      		{ indexName:'stu_name',indexKey:'name',indexOptions:{ unqiue:false,mulitEntry:false } },
      	]
      }).then(function(store){
        expect(store instanceof IDBDatabase).equal(true);
        done();
      }).catch(function(err){
        expect(err instanceof Error).equal(true);
        done();
      })
    });
  });
});

describe('getStore', function() {
  describe('get store "users" in db "abc"', function() {
    it('should return the store "users"', function(done) {
      myDB.openDB('abc').then(function(db){
        var store_users = myDB.getStore(db, 'users');
        expect(store_users instanceof IDBObjectStore).equal(true);
        done();
      }).catch(function(err){
        expect(err instanceof Error).equal(true);
        done();
      })
    });
  });
});
