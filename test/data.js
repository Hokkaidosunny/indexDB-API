describe('data.js', function() {
  var myDB,
      store_users;
  IndexDB.getDB('abc').then(function(db) {
    myDB = db;
    expect(db instanceof IDBDatabase).equal(true);
    return IndexDB.getStore(db, 'users');
  }).then(function(store) {
    store_users = store;
    return IndexDB.getAllData(store);
  }).then(function(allData) {
    console.log(allData);
    expect(typeof allData).equal('object');

    return IndexDB.addOneData(store_users, {id: 6, name: 'ssj', h: 4});
  }).then(function(count) {
    console.log(count);
    return IndexDB.getDataByIndex(store_users, 'id', 1);
  }).then(function(data) {
    console.log(data);
    return IndexDB.getRangeDataByPrimaryKey(store_users, 3, 6);
  }).then(function(data){
    console.log(data);
  });
});
