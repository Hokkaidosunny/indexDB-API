var expect = chai.expect
var getType = Object.prototype.toString

mocha.ui('bdd')

describe('db.js', function() {
  describe("openDB('abc')", () => {
    it("should return a IDBDatabase instance named 'abc'", () => {
      return IndexDB.openDB('abc').then(db => {
        expect(db instanceof IDBDatabase).equal(true)
        expect(db.name).equal('abc')
      })
    })
  })

  describe("getDB('abc')", function() {
    it("should return a IDBDatabase instance named 'abc'", () => {
      return IndexDB.getDB('abc').then(db => {
        expect(db instanceof IDBDatabase).equal(true)
        expect(db.name).equal('abc')
      })
    })
  })

  describe("closeDB('abc')", function() {
    it('should delete DB abc', () => {
      return IndexDB.deleteDB('abc').then(() => {
        expect(IndexDB.DBs['abc']).equal(undefined)
      })
    })
  })

  describe("deleteDB('abc')", function() {
    it('should return undefined', function() {
      return IndexDB.deleteDB('abc').then(event => {
        expect(event.target.result).equal(undefined)
      })
    })
  })
})
