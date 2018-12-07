const {
  createStore,
  getStore,
  getStoreCount,
  deleteStore,
  clearStore
} = IndexDB

describe('store.js', function() {
  describe('createStore', function() {
    it("should create store named 'users'and return it", () => {
      var options = {
        dbName: 'abc',
        storeName: 'users',
        keyOptions: {
          keyPath: 'id', // primary key
          autoIncrement: false
        }
      }

      return createStore(options).then(store => {
        expect(store instanceof IDBObjectStore).equal(true)
        expect(store.name).equal('users')
      })
    })
  })

  describe('getStore', function() {
    it('should return store', function() {
      const store = getStore('abc', 'users')

      expect(store instanceof IDBObjectStore).equal(true)
      expect(store.name).equal('users')
    })
  })

  describe('getStoreCount', function() {
    it('should return store count', function() {
      return IndexDB.getStoreCount('abc', 'users').then(count => {
        expect(typeof count).equal('number')
      })
    })
  })

  describe('clearStore', function() {
    it('should return store count', function() {
      const res = clearStore('abc', 'users')
      expect(res).equal(true)
    })
  })

  describe('deleteStore', function() {
    it("should delete store 'users' and return db 'abc'", function() {
      return deleteStore('abc', 'users').then(() => {
        const store = getStore('abc', 'users')
        expect(store).equal(undefined)
      })
    })
  })
})
