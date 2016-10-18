mocha.ui('bdd');
mocha.timeout(2000);
var expect = chai.expect;

/*describe('db.js', function(){
  describe('getDBNames function', function() {
    it('should return an array', function() {
      return IndexDB.getDBNames().then(function(dbNames){
        expect(typeof dbNames.length).equal('number');
      });
    });
  });

  describe('createDB function', function() {
    it('should return a db', function() {
      return IndexDB.createDB('abc').then(function(db){
        expect(db instanceof IDBDatabase).equal(true);
      }).catch(function(err) {
        expect(err.message).equal('db abc has existed');
      });
    });
  });

  describe('getDB function', function() {
    it('should return a db', function() {
      return IndexDB.createDB('abc').then(function(db){
        return IndexDB.getDB('abc');
      }).then(function(db) {
        expect(db instanceof IDBDatabase).equal(true);
      }).catch(function(err) {
        expect(err.message).equal('db abc has existed');
      });
    });
  });

});*/
