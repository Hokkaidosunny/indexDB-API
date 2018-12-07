const {
  openDB,
  deleteDB,
  getAllData,
  getDataByIndex,
  getRangeDataByPrimaryKey,
  addOneData,
  putOneData,
  deleteDataByPrimaKey
} = IndexDB

describe('data.js', function() {
  describe('getAllData : get all data from store users in db abc', function() {
    it('should return array', function() {
      return deleteDB('abc')
        .then(() => openDB('abc'))
        .then(() =>
          createStore('abc', 'users', {
            keyOptions: {
              keyPath: 'id',
              autoIncrement: false
            },
            indexes: [
              {
                indexName: 'idIndex',
                indexKey: 'id',
                indexOptions: { unqiue: false, mulitEntry: false }
              },
              {
                indexName: 'nameIndex',
                indexKey: 'name',
                indexOptions: { unqiue: false, mulitEntry: false }
              }
            ]
          })
        )
        .then(() => getAllData('abc', 'users'))
        .then(allData => {
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

      return addOneData('abc', 'users', data).then(count => {
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

      return putOneData('abc', 'users', data).then(count => {
        expect(typeof count).equal('number')
      })
    })
  })

  describe('getDataByIndex', function() {
    it("should return an object within a 'name' property, and the value is 'Tom'", function() {
      return getDataByIndex('abc', 'users', 'idIndex', 1).then(data => {
        expect(data.name).equal('Tom')
      })
    })
  })

  describe('getRangeDataByPrimaryKey(dbName, storeName, start, end) : get data by Range', function() {
    it('should return an array', function() {
      return getRangeDataByPrimaryKey('abc', 'users', 1, 2).then(allData => {
        expect(getType.call(allData)).equal('[object Array]')
        expect(allData.length).equal(1)
      })
    })
  })

  describe('deleteDataByPrimaKey(dbName, storeName, primaryKeyValue) : delete data by primaryKeyValue', function() {
    it('should return bool', function() {
      return deleteDataByPrimaKey('abc', 'users', 1).then(res => {
        expect(res).equal(true)
      })
    })
  })
})
