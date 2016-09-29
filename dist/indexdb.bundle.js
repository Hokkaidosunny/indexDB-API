(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.IndexDB = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * get object values
 * @return {Array}
 */
var IndexDB = function () {
  function IndexDB() {
    classCallCheck(this, IndexDB);
  }

  /**
   * get all the db names
   */
  IndexDB.prototype.getDBNames = function getDBNames() {
    return new Promise(function (resolve, reject) {
      var get_dbNames_req = indexedDB.webkitGetDatabaseNames();

      get_dbNames_req.onsuccess = function (event) {
        var dbNames = Array.prototype.slice.call(event.target.result);
        resolve(dbNames);
      };

      get_dbNames_req.onerror = function (event) {
        reject(new Error('error, db errorCode: ' + event.target.errorCode));
      };
    });
  };

  /**
   * create a new db
   */


  IndexDB.prototype.createDB = function createDB(dbName) {
    var _this = this;

    var version = arguments.length <= 1 || arguments[1] === undefined ? new Date().getTime() : arguments[1];

    return new Promise(function (resolve, reject) {
      _this.getDBNames().then(function (dbNames) {
        if (dbNames.indexOf(dbName) >= 0) {
          throw new Error('db ' + dbName + ' has existed');
        }

        var dbConnect = indexedDB.open(dbName, version);
        dbConnect.onsuccess = function (event) {
          resolve(event.target.result);
        };
        dbConnect.onerror = function (event) {
          reject(event.target.errorCode);
        };
      }).catch(function (error) {
        reject(error);
      });
    });
  };

  /**
   * open an existed db
   */


  IndexDB.prototype.openDB = function openDB(dbName) {
    var _this2 = this;

    var version = arguments.length <= 1 || arguments[1] === undefined ? new Date().getTime() : arguments[1];

    return new Promise(function (resolve, reject) {
      _this2.getDBNames().then(function (dbNames) {
        if (dbNames.indexOf(dbName) >= 0) {
          var dbConnect = indexedDB.open(dbName, version);

          dbConnect.onsuccess = function (event) {
            resolve(event.target.result);
          };
          dbConnect.onerror = function (event) {
            reject(event);
          };
        } else {
          throw new Error('db ' + dbName + ' doesn\'t existes');
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  };

  /**
   * create a new store in an existed db
   */


  IndexDB.prototype.createStore = function createStore(_ref) {
    var _this3 = this;

    var _ref$dbName = _ref.dbName;
    var dbName = _ref$dbName === undefined ? null : _ref$dbName;
    var _ref$storeName = _ref.storeName;
    var storeName = _ref$storeName === undefined ? null : _ref$storeName;
    var _ref$version = _ref.version;
    var version = _ref$version === undefined ? new Date().getTime() : _ref$version;
    var _ref$keyOptions = _ref.keyOptions;
    var keyOptions = _ref$keyOptions === undefined ? {} : _ref$keyOptions;
    var _ref$index = _ref.index;
    var index = _ref$index === undefined ? [] : _ref$index;

    if (!dbName || !storeName) {
      console.error('dbName and storeName are required');
      return false;
    }

    return new Promise(function (resolve, reject) {
      _this3.getDBNames().then(function (dbNames) {
        if (dbNames.indexOf(dbName) >= 0) {
          var dbConnect = indexedDB.open(dbName, version);

          dbConnect.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (db.objectStoreNames.contains(storeName)) {
              //是否已存在该对象库
              reject(new Error('storeName ' + storeName + ' has existed'));
            } else {
              var store = db.createObjectStore(storeName, keyOptions); //创建对象库
              for (var i in index) {
                //创建索引
                store.createIndex(index[i].indexName, index[i].indexKey, index[i].indexOptions);
              }
              resolve(store);
            }
          };

          dbConnect.onerror = function (event) {
            reject(new Error('error, db errorCode: ' + event.target.errorCode));
          };
        } else {
          throw new Error('db ' + dbName + ' doesn\'t existes');
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  };

  IndexDB.prototype.getStore = function getStore(db, storeName) {
    if (db.objectStoreNames.contains(storeName)) {
      var tx = db.transaction(storeName, 'readwrite');
      return tx.objectStore(storeName);
    } else {
      console.error('store ' + storeName + ' doesn\'t existes');
    }
  };

  return IndexDB;
}();

return IndexDB;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL2xpYi9pbmRleGRiLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZ2V0IG9iamVjdCB2YWx1ZXNcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBfb2JqZWN0VmFsdWVzKG9iail7XG4gIGlmICgob2JqIGluc3RhbmNlb2YgT2JqZWN0KSAmJiAodHlwZW9mIG9iai5sZW5ndGggPT09ICd1bmRlZmluZWQnKSkge1xuICAgIGxldCB2YWx1ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICB2YWx1ZXMucHVzaChvYmpba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihgJHtvYmp9IGV4cGVjdGVkIHRvIGJlIGFuIE9iamVjdGApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5jbGFzcyBJbmRleERCe1xuXG4gIC8qKlxuICAgKiBnZXQgYWxsIHRoZSBkYiBuYW1lc1xuICAgKi9cbiAgZ2V0REJOYW1lcygpe1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBnZXRfZGJOYW1lc19yZXEgPSBpbmRleGVkREIud2Via2l0R2V0RGF0YWJhc2VOYW1lcygpO1xuXG4gICAgICBnZXRfZGJOYW1lc19yZXEub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGRiTmFtZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgcmVzb2x2ZShkYk5hbWVzKTtcbiAgICAgIH07XG5cbiAgICAgIGdldF9kYk5hbWVzX3JlcS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYGVycm9yLCBkYiBlcnJvckNvZGU6ICR7ZXZlbnQudGFyZ2V0LmVycm9yQ29kZX1gKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGEgbmV3IGRiXG4gICAqL1xuICBjcmVhdGVEQihkYk5hbWUsIHZlcnNpb24gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSl7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuZ2V0REJOYW1lcygpLnRoZW4oKGRiTmFtZXMpID0+IHtcbiAgICAgICAgaWYgKGRiTmFtZXMuaW5kZXhPZihkYk5hbWUpID49IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGRiICR7ZGJOYW1lfSBoYXMgZXhpc3RlZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGJDb25uZWN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lLCB2ZXJzaW9uKTtcbiAgICAgICAgZGJDb25uZWN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIGRiQ29ubmVjdC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgICAgICB9O1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIG9wZW4gYW4gZXhpc3RlZCBkYlxuICAgKi9cbiAgb3BlbkRCKGRiTmFtZSwgdmVyc2lvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuZ2V0REJOYW1lcygpLnRoZW4oKGRiTmFtZXMpID0+IHtcbiAgICAgICAgaWYgKGRiTmFtZXMuaW5kZXhPZihkYk5hbWUpID49IDApIHtcbiAgICAgICAgICBjb25zdCBkYkNvbm5lY3QgPSBpbmRleGVkREIub3BlbihkYk5hbWUsIHZlcnNpb24pO1xuXG4gICAgICAgICAgZGJDb25uZWN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGRiQ29ubmVjdC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZWplY3QoZXZlbnQpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBkYiAke2RiTmFtZX0gZG9lc24ndCBleGlzdGVzYCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGEgbmV3IHN0b3JlIGluIGFuIGV4aXN0ZWQgZGJcbiAgICovXG4gIGNyZWF0ZVN0b3JlKHtcbiAgICBkYk5hbWUgPSBudWxsLFxuICAgIHN0b3JlTmFtZSA9IG51bGwsXG4gICAgdmVyc2lvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgIGtleU9wdGlvbnMgPSB7fSxcbiAgICBpbmRleCA9IFtdXG4gIH0pIHtcbiAgICBpZiAoIWRiTmFtZSB8fCAhc3RvcmVOYW1lKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBkYk5hbWUgYW5kIHN0b3JlTmFtZSBhcmUgcmVxdWlyZWRgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5nZXREQk5hbWVzKCkudGhlbigoZGJOYW1lcykgPT4ge1xuICAgICAgICBpZiAoZGJOYW1lcy5pbmRleE9mKGRiTmFtZSkgPj0gMCkge1xuICAgICAgICAgIGNvbnN0IGRiQ29ubmVjdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSwgdmVyc2lvbik7XG5cbiAgICAgICAgICBkYkNvbm5lY3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XG4gICAgICBcdFx0XHRjb25zdCBkYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgXHRcdFx0XHRpZiAoZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhzdG9yZU5hbWUpKSB7ICAvL+aYr+WQpuW3suWtmOWcqOivpeWvueixoeW6k1xuICAgIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKGBzdG9yZU5hbWUgJHtzdG9yZU5hbWV9IGhhcyBleGlzdGVkYCkpO1xuICAgIFx0XHRcdFx0fSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3Qgc3RvcmUgPSBkYi5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUsIGtleU9wdGlvbnMpOyAvL+WIm+W7uuWvueixoeW6k1xuICAgIFx0XHRcdFx0XHRmb3IgKGxldCBpIGluIGluZGV4KSB7ICAvL+WIm+W7uue0ouW8lVxuICAgIFx0XHRcdFx0XHRcdHN0b3JlLmNyZWF0ZUluZGV4KFxuICAgIFx0XHRcdFx0XHRcdFx0aW5kZXhbaV0uaW5kZXhOYW1lLFxuICAgIFx0XHRcdFx0XHRcdFx0aW5kZXhbaV0uaW5kZXhLZXksXG4gICAgXHRcdFx0XHRcdFx0XHRpbmRleFtpXS5pbmRleE9wdGlvbnNcbiAgICBcdFx0XHRcdFx0XHQpO1xuICAgIFx0XHRcdFx0XHR9XG4gICAgICAgICAgICAgIHJlc29sdmUoc3RvcmUpO1xuICAgIFx0XHRcdFx0fVxuICAgICAgXHQgIH07XG5cbiAgICAgICAgICBkYkNvbm5lY3Qub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgZXJyb3IsIGRiIGVycm9yQ29kZTogJHtldmVudC50YXJnZXQuZXJyb3JDb2RlfWApKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBkYiAke2RiTmFtZX0gZG9lc24ndCBleGlzdGVzYCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cdH1cblxuICBnZXRTdG9yZShkYiwgc3RvcmVOYW1lKSB7XG4gICAgaWYgKGRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoc3RvcmVOYW1lKSkge1xuICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihzdG9yZU5hbWUsICdyZWFkd3JpdGUnKTtcbiAgICAgIHJldHVybiB0eC5vYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBzdG9yZSAke3N0b3JlTmFtZX0gZG9lc24ndCBleGlzdGVzYCk7XG4gICAgfVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4REI7XG4iXSwibmFtZXMiOlsiSW5kZXhEQiIsImdldERCTmFtZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdldF9kYk5hbWVzX3JlcSIsImluZGV4ZWREQiIsIndlYmtpdEdldERhdGFiYXNlTmFtZXMiLCJvbnN1Y2Nlc3MiLCJldmVudCIsImRiTmFtZXMiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsInRhcmdldCIsInJlc3VsdCIsIm9uZXJyb3IiLCJFcnJvciIsImVycm9yQ29kZSIsImNyZWF0ZURCIiwiZGJOYW1lIiwidmVyc2lvbiIsIkRhdGUiLCJnZXRUaW1lIiwidGhlbiIsImluZGV4T2YiLCJkYkNvbm5lY3QiLCJvcGVuIiwiY2F0Y2giLCJlcnJvciIsIm9wZW5EQiIsImNyZWF0ZVN0b3JlIiwic3RvcmVOYW1lIiwia2V5T3B0aW9ucyIsImluZGV4Iiwib251cGdyYWRlbmVlZGVkIiwiZGIiLCJvYmplY3RTdG9yZU5hbWVzIiwiY29udGFpbnMiLCJzdG9yZSIsImNyZWF0ZU9iamVjdFN0b3JlIiwiaSIsImNyZWF0ZUluZGV4IiwiaW5kZXhOYW1lIiwiaW5kZXhLZXkiLCJpbmRleE9wdGlvbnMiLCJnZXRTdG9yZSIsInR4IiwidHJhbnNhY3Rpb24iLCJvYmplY3RTdG9yZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBLElBYU1BOzs7Ozs7OztvQkFLSkMsbUNBQVk7V0FDSCxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO1VBQ2hDQyxrQkFBa0JDLFVBQVVDLHNCQUFWLEVBQXhCOztzQkFFZ0JDLFNBQWhCLEdBQTRCLFVBQUNDLEtBQUQsRUFBVztZQUMvQkMsVUFBVUMsTUFBTUMsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCTCxNQUFNTSxNQUFOLENBQWFDLE1BQXhDLENBQWhCO2dCQUNRTixPQUFSO09BRkY7O3NCQUtnQk8sT0FBaEIsR0FBMEIsVUFBQ1IsS0FBRCxFQUFXO2VBQzVCLElBQUlTLEtBQUosMkJBQWtDVCxNQUFNTSxNQUFOLENBQWFJLFNBQS9DLENBQVA7T0FERjtLQVJLLENBQVA7Ozs7Ozs7O29CQWlCRkMsNkJBQVNDLFFBQXVDOzs7UUFBL0JDLE9BQStCLHlEQUFyQixJQUFJQyxJQUFKLEdBQVdDLE9BQVgsRUFBcUI7O1dBQ3ZDLElBQUl0QixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO1lBQ2pDSCxVQUFMLEdBQWtCd0IsSUFBbEIsQ0FBdUIsVUFBQ2YsT0FBRCxFQUFhO1lBQzlCQSxRQUFRZ0IsT0FBUixDQUFnQkwsTUFBaEIsS0FBMkIsQ0FBL0IsRUFBa0M7Z0JBQzFCLElBQUlILEtBQUosU0FBZ0JHLE1BQWhCLGtCQUFOOzs7WUFHSU0sWUFBWXJCLFVBQVVzQixJQUFWLENBQWVQLE1BQWYsRUFBdUJDLE9BQXZCLENBQWxCO2tCQUNVZCxTQUFWLEdBQXNCLFVBQUNDLEtB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
