describe('store.js', function(){
  describe('createStore function', function() {
    it('should create store and return it', function() {
      var options = {
        dbName: 'abc',
        storeName: 'users',
        keyOptions: {
          keyPath: 'id', //主键
          autoIncrement: false //是否自增长
        },
        index: [  //索引项
          { indexName: 'id', indexKey: 'id', indexOptions: { unqiue: false, mulitEntry: false } },
          { indexName: 'name', indexKey: 'name', indexOptions: { unqiue: false, mulitEntry: false } }
        ]
      };

      return IndexDB.getDB('abc').then(function(db) {
        return IndexDB.createStore(options);
      }).then(function(store){
        expect(store instanceof IDBObjectStore).equal(true);
      }).catch(function(err){
        var errMsgs = ['storeName users has existed', "db abc doesn't existes", 'you need call getDB function first'];
        var assert = errMsgs.indexOf(err.message) >= 0;
        expect(assert).equal(true);
      });
    });
  });

  describe('getStore function', function(){
    it('should return store', function(){
      return IndexDB.getDB('abc').then(function(db){
        var store_users = IndexDB.getStore(db, 'users');
        expect(store_users instanceof IDBObjectStore).equal(true);
      });
    });
  });

  describe('getStoreCount function', function(){
    it('should return store count', function(){
      return IndexDB.getDB('abc').then(function(db){
        return IndexDB.getStoreCount(db, 'users');
      }).then(function(count) {
        expect(typeof count).equal('number');
      });
    })
  });

/*  describe('deleteStore function', function(){
    it('should delete store', function(){
      return IndexDB.deleteStore('abc', 'users').then(function(db){
        console.log(db);
      });
    });
  });*/




});
