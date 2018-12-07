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
        keyOptions: {
          keyPath: 'id', // primary key
          autoIncrement: false
        }
      }

      return createStore('abc', 'users', options).then(store => {
        expect(store instanceof IDBObjectStore).equal(true)
        expect(store.name).equal('users')
      })
    })
  })

  describe('getStore', function() {
    it('should return store', function() {
      return getStore('abc', 'users').then(store => {
        expect(store instanceof IDBObjectStore).equal(true)
        expect(store.name).equal('users')
      })
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
      return clearStore('abc', 'users').then(res => {
        expect(res).equal(true)
      })
    })
  })

  describe('deleteStore', function() {
    it("should delete store 'users'", function() {
      return deleteStore('abc', 'users').then(res => {
        expect(res).equal(true)
      })
    })
  })
})
