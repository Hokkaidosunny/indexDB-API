(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IndexDB"] = factory();
	else
		root["IndexDB"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/data.js":
/*!*********************!*\
  !*** ./src/data.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.getAllData = getAllData;\nexports.getDataByIndex = getDataByIndex;\nexports.getRangeDataByPrimaryKey = getRangeDataByPrimaryKey;\nexports.addOneData = addOneData;\nexports.putOneData = putOneData;\nexports.deleteDataByPrimaKey = deleteDataByPrimaKey;\n\nvar _store = __webpack_require__(/*! ./store */ \"./src/store.js\");\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * getAllData\n * @param {*} dbName\n * @param {*} storeName\n */\nfunction getAllData(_x, _x2) {\n  return _getAllData.apply(this, arguments);\n}\n/**\n * getDataByIndex\n * @param {*} dbName\n * @param {*} storeName\n * @param {*} indexName\n * @param {*} value\n */\n\n\nfunction _getAllData() {\n  _getAllData = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee(dbName, storeName) {\n    var store;\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.next = 2;\n            return (0, _store.getStore)(dbName, storeName);\n\n          case 2:\n            store = _context.sent;\n            return _context.abrupt(\"return\", new Promise(function (resolve, reject) {\n              var dataArr = [];\n              var req = store.openCursor();\n\n              req.onsuccess = function (event) {\n                var cursor = event.target.result;\n\n                if (cursor) {\n                  dataArr.push(cursor.value);\n                  cursor.continue();\n                } else {\n                  resolve(dataArr);\n                }\n              };\n\n              req.onerror = reject;\n            }));\n\n          case 4:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, this);\n  }));\n  return _getAllData.apply(this, arguments);\n}\n\nfunction getDataByIndex(_x3, _x4, _x5, _x6) {\n  return _getDataByIndex.apply(this, arguments);\n}\n/**\n * getRangeDataByPrimaryKey\n */\n\n\nfunction _getDataByIndex() {\n  _getDataByIndex = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee2(dbName, storeName, indexName, value) {\n    var store;\n    return regeneratorRuntime.wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            _context2.next = 2;\n            return (0, _store.getStore)(dbName, storeName);\n\n          case 2:\n            store = _context2.sent;\n            return _context2.abrupt(\"return\", new Promise(function (resolve, reject) {\n              var index = store.index(indexName);\n              var req = index.get(value);\n\n              req.onsuccess = function (event) {\n                resolve(event.target.result);\n              };\n\n              req.onerror = reject;\n            }));\n\n          case 4:\n          case \"end\":\n            return _context2.stop();\n        }\n      }\n    }, _callee2, this);\n  }));\n  return _getDataByIndex.apply(this, arguments);\n}\n\nfunction getRangeDataByPrimaryKey(_x7, _x8, _x9, _x10) {\n  return _getRangeDataByPrimaryKey.apply(this, arguments);\n}\n/**\n * addOneData\n */\n\n\nfunction _getRangeDataByPrimaryKey() {\n  _getRangeDataByPrimaryKey = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee3(dbName, storeName, start, end) {\n    var store;\n    return regeneratorRuntime.wrap(function _callee3$(_context3) {\n      while (1) {\n        switch (_context3.prev = _context3.next) {\n          case 0:\n            _context3.next = 2;\n            return (0, _store.getStore)(dbName, storeName);\n\n          case 2:\n            store = _context3.sent;\n            return _context3.abrupt(\"return\", new Promise(function (resolve, reject) {\n              var range = IDBKeyRange.bound(start, end);\n              var dataArr = [];\n              var req = store.openCursor(range);\n\n              req.onsuccess = function (event) {\n                var cursor = event.target.result;\n\n                if (cursor) {\n                  dataArr.push(cursor.value);\n                  cursor.continue();\n                } else {\n                  resolve(dataArr);\n                }\n              };\n\n              req.onerror = reject;\n            }));\n\n          case 4:\n          case \"end\":\n            return _context3.stop();\n        }\n      }\n    }, _callee3, this);\n  }));\n  return _getRangeDataByPrimaryKey.apply(this, arguments);\n}\n\nfunction addOneData(_x11, _x12, _x13) {\n  return _addOneData.apply(this, arguments);\n}\n/**\n * putOneData\n * update a data accoring to the primary key\n * you can use putOneData to add a data, when the primary is the same, then putOneData will update the old data\n */\n\n\nfunction _addOneData() {\n  _addOneData = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee4(dbName, storeName, data) {\n    var store;\n    return regeneratorRuntime.wrap(function _callee4$(_context4) {\n      while (1) {\n        switch (_context4.prev = _context4.next) {\n          case 0:\n            _context4.next = 2;\n            return (0, _store.getStore)(dbName, storeName);\n\n          case 2:\n            store = _context4.sent;\n            return _context4.abrupt(\"return\", new Promise(function (resolve, reject) {\n              var req = store.add(data);\n\n              req.onsuccess = function (event) {\n                // event.target.result is the count of the data\n                resolve(event.target.result);\n              };\n\n              req.onerror = reject;\n            }));\n\n          case 4:\n          case \"end\":\n            return _context4.stop();\n        }\n      }\n    }, _callee4, this);\n  }));\n  return _addOneData.apply(this, arguments);\n}\n\nfunction putOneData(_x14, _x15, _x16) {\n  return _putOneData.apply(this, arguments);\n}\n/**\n * deleteDataByPrimaKey\n */\n\n\nfunction _putOneData() {\n  _putOneData = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee5(dbName, storeName, data) {\n    var store;\n    return regeneratorRuntime.wrap(function _callee5$(_context5) {\n      while (1) {\n        switch (_context5.prev = _context5.next) {\n          case 0:\n            _context5.next = 2;\n            return (0, _store.getStore)(dbName, storeName);\n\n          case 2:\n            store = _context5.sent;\n            return _context5.abrupt(\"return\", new Promise(function (resolve, reject) {\n              var req = store.put(data);\n\n              req.onsuccess = function (event) {\n                resolve(event.target.result);\n              };\n\n              req.onerror = reject;\n            }));\n\n          case 4:\n          case \"end\":\n            return _context5.stop();\n        }\n      }\n    }, _callee5, this);\n  }));\n  return _putOneData.apply(this, arguments);\n}\n\nfunction deleteDataByPrimaKey(_x17, _x18, _x19) {\n  return _deleteDataByPrimaKey.apply(this, arguments);\n}\n\nfunction _deleteDataByPrimaKey() {\n  _deleteDataByPrimaKey = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee6(dbName, storeName, primaryKeyValue) {\n    var store;\n    return regeneratorRuntime.wrap(function _callee6$(_context6) {\n      while (1) {\n        switch (_context6.prev = _context6.next) {\n          case 0:\n            _context6.next = 2;\n            return (0, _store.getStore)(dbName, storeName);\n\n          case 2:\n            store = _context6.sent;\n\n            if (!store) {\n              _context6.next = 6;\n              break;\n            }\n\n            store.delete(primaryKeyValue);\n            return _context6.abrupt(\"return\", true);\n\n          case 6:\n          case \"end\":\n            return _context6.stop();\n        }\n      }\n    }, _callee6, this);\n  }));\n  return _deleteDataByPrimaKey.apply(this, arguments);\n}\n\n//# sourceURL=webpack://IndexDB/./src/data.js?");

/***/ }),

/***/ "./src/db.js":
/*!*******************!*\
  !*** ./src/db.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.openDB = openDB;\nexports.closeDB = closeDB;\nexports.getDB = getDB;\nexports.deleteDB = deleteDB;\nexports.DBs = void 0;\n\nvar _util = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * DB pool\n */\nvar DBs = {};\n/**\n * create/open a new DB\n * @param {*} dbName\n * @param {*} version\n */\n\nexports.DBs = DBs;\n\nfunction openDB(dbName, listener, version) {\n  if (listener === void 0) {\n    listener = {};\n  }\n\n  if (version === void 0) {\n    version = (0, _util.timeStamp)();\n  }\n\n  var _listener = listener,\n      onupgradeneeded = _listener.onupgradeneeded;\n  closeDB(dbName);\n  return new Promise(function (resolve, reject) {\n    var req = indexedDB.open(dbName, version);\n\n    req.onsuccess = function (event) {\n      DBs[dbName] = event.target.result; //save the opened db\n\n      resolve(event.target.result);\n    };\n\n    req.onupgradeneeded = onupgradeneeded;\n    req.onerror = reject;\n  });\n}\n/**\n * close a DB\n * @param {*} dbName\n */\n\n\nfunction closeDB(dbName) {\n  var curDB = DBs[dbName];\n\n  if (curDB) {\n    curDB.close();\n    delete DBs[dbName];\n    return Promise.resolve(true);\n  } else {\n    return Promise.resolve();\n  }\n}\n/**\n * delete a DB\n * @param {string} dbName\n */\n\n\nfunction deleteDB(_x) {\n  return _deleteDB.apply(this, arguments);\n}\n/**\n * get DB from DBs\n * @param {string} dbName\n */\n\n\nfunction _deleteDB() {\n  _deleteDB = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee(dbName) {\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.next = 2;\n            return closeDB(dbName);\n\n          case 2:\n            return _context.abrupt(\"return\", new Promise(function (resolve, reject) {\n              var dbConnect = indexedDB.deleteDatabase(dbName);\n              dbConnect.onsuccess = resolve;\n              dbConnect.onerror = reject;\n            }));\n\n          case 3:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, this);\n  }));\n  return _deleteDB.apply(this, arguments);\n}\n\nfunction getDB(dbName) {\n  var curDB = DBs[dbName];\n\n  if (curDB) {\n    return Promise.resolve(curDB);\n  } else {\n    return Promise.reject(new Error(\"please open \" + dbName + \" DB first\"));\n  }\n}\n\n//# sourceURL=webpack://IndexDB/./src/db.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = void 0;\n\nvar db = _interopRequireWildcard(__webpack_require__(/*! ./db */ \"./src/db.js\"));\n\nvar data = _interopRequireWildcard(__webpack_require__(/*! ./data */ \"./src/data.js\"));\n\nvar store = _interopRequireWildcard(__webpack_require__(/*! ./store */ \"./src/store.js\"));\n\nvar _util = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nif (!window.indexedDB) {\n  (0, _util.showErrorMsg)('Your browser doesnt support indexedDB.');\n}\n\nvar _default = _extends({}, db, data, store);\n\nexports.default = _default;\n\n//# sourceURL=webpack://IndexDB/./src/index.js?");

/***/ }),

/***/ "./src/store.js":
/*!**********************!*\
  !*** ./src/store.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.getStore = getStore;\nexports.createStore = createStore;\nexports.getStoreCount = getStoreCount;\nexports.deleteStore = deleteStore;\nexports.clearStore = clearStore;\n\nvar _util = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\nvar _db = __webpack_require__(/*! ./db */ \"./src/db.js\");\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * create a new store in an existed db\n */\nfunction createStore(_x, _x2, _x3, _x4) {\n  return _createStore.apply(this, arguments);\n}\n/**\n * getStore\n * @param {string} dbName\n * @param {string} storeName\n */\n\n\nfunction _createStore() {\n  _createStore = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee(dbName, storeName, _ref, version) {\n    var _ref$keyOptions, keyOptions, _ref$indexes, indexes, store;\n\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _ref$keyOptions = _ref.keyOptions, keyOptions = _ref$keyOptions === void 0 ? {} : _ref$keyOptions, _ref$indexes = _ref.indexes, indexes = _ref$indexes === void 0 ? [] : _ref$indexes;\n\n            if (version === void 0) {\n              version = (0, _util.timeStamp)();\n            }\n\n            _context.next = 4;\n            return (0, _db.openDB)(dbName, {\n              onupgradeneeded: function onupgradeneeded(event) {\n                var db = event.target.result;\n\n                if (db.objectStoreNames.contains(storeName)) {\n                  return;\n                }\n\n                store = db.createObjectStore(storeName, keyOptions); // create index\n\n                indexes.forEach(function (e) {\n                  return store.createIndex(e.indexName, e.indexKey, e.indexOptions);\n                });\n              }\n            }, version);\n\n          case 4:\n            return _context.abrupt(\"return\", store);\n\n          case 5:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, this);\n  }));\n  return _createStore.apply(this, arguments);\n}\n\nfunction getStore(_x5, _x6) {\n  return _getStore.apply(this, arguments);\n}\n/**\n * deleteStore\n * @param {string} dbName\n * @param {string} storeName\n * @param {*} version\n */\n\n\nfunction _getStore() {\n  _getStore = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee2(dbName, storeName) {\n    var curDB;\n    return regeneratorRuntime.wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            _context2.next = 2;\n            return (0, _db.getDB)(dbName);\n\n          case 2:\n            curDB = _context2.sent;\n            return _context2.abrupt(\"return\", new Promise(function (resolve, reject) {\n              if (curDB.objectStoreNames.contains(storeName)) {\n                // you should create transaction before do anything to store\n                var transaction = curDB.transaction(storeName, 'readwrite');\n                var store = transaction.objectStore(storeName);\n                resolve(store);\n              } else {\n                reject(new Error('no this store'));\n              }\n            }));\n\n          case 4:\n          case \"end\":\n            return _context2.stop();\n        }\n      }\n    }, _callee2, this);\n  }));\n  return _getStore.apply(this, arguments);\n}\n\nfunction deleteStore(_x7, _x8, _x9) {\n  return _deleteStore.apply(this, arguments);\n}\n/**\n * getStoreCount\n * @param {*} dbName\n * @param {*} storeName\n */\n\n\nfunction _deleteStore() {\n  _deleteStore = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee3(dbName, storeName, version) {\n    return regeneratorRuntime.wrap(function _callee3$(_context3) {\n      while (1) {\n        switch (_context3.prev = _context3.next) {\n          case 0:\n            if (version === void 0) {\n              version = (0, _util.timeStamp)();\n            }\n\n            _context3.next = 3;\n            return (0, _db.openDB)(dbName, {\n              onupgradeneeded: function onupgradeneeded(event) {\n                var db = event.target.result;\n\n                if (db.objectStoreNames.contains(storeName)) {\n                  db.deleteObjectStore(storeName);\n                }\n              }\n            }, version);\n\n          case 3:\n            return _context3.abrupt(\"return\", true);\n\n          case 4:\n          case \"end\":\n            return _context3.stop();\n        }\n      }\n    }, _callee3, this);\n  }));\n  return _deleteStore.apply(this, arguments);\n}\n\nfunction getStoreCount(_x10, _x11) {\n  return _getStoreCount.apply(this, arguments);\n}\n/**\n * clearStore\n * @param {*} dbName\n * @param {*} storeName\n */\n\n\nfunction _getStoreCount() {\n  _getStoreCount = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee4(dbName, storeName) {\n    var store;\n    return regeneratorRuntime.wrap(function _callee4$(_context4) {\n      while (1) {\n        switch (_context4.prev = _context4.next) {\n          case 0:\n            _context4.next = 2;\n            return getStore(dbName, storeName);\n\n          case 2:\n            store = _context4.sent;\n            return _context4.abrupt(\"return\", new Promise(function (resolve, reject) {\n              var req = store.count();\n\n              req.onsuccess = function (event) {\n                var count = event.target.result;\n                resolve(count);\n              };\n\n              req.onerror = reject;\n            }));\n\n          case 4:\n          case \"end\":\n            return _context4.stop();\n        }\n      }\n    }, _callee4, this);\n  }));\n  return _getStoreCount.apply(this, arguments);\n}\n\nfunction clearStore(_x12, _x13) {\n  return _clearStore.apply(this, arguments);\n}\n\nfunction _clearStore() {\n  _clearStore = _asyncToGenerator(\n  /*#__PURE__*/\n  regeneratorRuntime.mark(function _callee5(dbName, storeName) {\n    var store;\n    return regeneratorRuntime.wrap(function _callee5$(_context5) {\n      while (1) {\n        switch (_context5.prev = _context5.next) {\n          case 0:\n            _context5.next = 2;\n            return getStore(dbName, storeName);\n\n          case 2:\n            store = _context5.sent;\n\n            if (!store) {\n              _context5.next = 6;\n              break;\n            }\n\n            store.clear();\n            return _context5.abrupt(\"return\", true);\n\n          case 6:\n          case \"end\":\n            return _context5.stop();\n        }\n      }\n    }, _callee5, this);\n  }));\n  return _clearStore.apply(this, arguments);\n}\n\n//# sourceURL=webpack://IndexDB/./src/store.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.showErrorMsg = exports.timeStamp = void 0;\n\nvar timeStamp = function timeStamp() {\n  return new Date().getTime();\n};\n\nexports.timeStamp = timeStamp;\n\nvar showErrorMsg = function showErrorMsg(msg) {\n  console.error(\"[indexdb-api]: \" + msg);\n};\n\nexports.showErrorMsg = showErrorMsg;\n\n//# sourceURL=webpack://IndexDB/./src/util.js?");

/***/ })

/******/ })["default"];
});