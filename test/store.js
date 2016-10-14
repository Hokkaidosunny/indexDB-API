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
          { indexName: 'stu_id', indexKey: 'id', indexOptions: { unqiue: false, mulitEntry: false } },
          { indexName: 'stu_name', indexKey: 'name', indexOptions: { unqiue: false, mulitEntry: false } }
        ]
      };

      return IndexDB.createStore(options).then(function(store){
        console.log(1);
        expect(store instanceof IDBDatabase).equal(true);
      });
    });
  });



});
