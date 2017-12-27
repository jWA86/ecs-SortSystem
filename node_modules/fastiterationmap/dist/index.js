(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FastIterationMap = /** @class */ (function () {
    function FastIterationMap() {
        this._keys = new Map();
        this._values = [];
    }
    FastIterationMap.prototype.clear = function () {
        this._keys.clear();
        this._values = [];
    };
    FastIterationMap.prototype.delete = function (key) {
        var i = this._keys.get(key);
        var r = this._keys.delete(key);
        this.offsetIndexInKeys(i, -1);
        var r2 = this._values.splice(i, 1);
        if (r2.length > 0 && r) {
            return true;
        }
        else {
            return false;
        }
    };
    FastIterationMap.prototype.get = function (key) {
        return this._values[this._keys.get(key)];
    };
    FastIterationMap.prototype.has = function (key) {
        return this._keys.has(key);
    };
    FastIterationMap.prototype.insertAfter = function (key, value, keyRef) {
        if (this._keys.get(key) !== undefined) {
            return false;
        }
        var i = this._keys.get(keyRef);
        this.insertValue(key, value, i + 1);
        if (i === undefined) {
            return false;
        }
        else {
            this.offsetIndexInKeys(i, 1);
            this._keys.set(key, i + 1);
            return true;
        }
    };
    FastIterationMap.prototype.insertBefore = function (key, value, keyRef) {
        if (this._keys.get(key) !== undefined) {
            return false;
        }
        var i = this._keys.get(keyRef);
        this.insertValue(key, value, i);
        if (i === undefined) {
            return false;
        }
        else {
            this.offsetIndexInKeys(i - 1, 1);
            this._keys.set(key, i);
            return true;
        }
    };
    Object.defineProperty(FastIterationMap.prototype, "keys", {
        get: function () {
            return this._keys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FastIterationMap.prototype, "length", {
        get: function () {
            return this._values.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FastIterationMap.prototype, "size", {
        get: function () {
            return this._values.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FastIterationMap.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    FastIterationMap.prototype.push = function (key, value) {
        var e = this._keys.get(key);
        // if the key doesn't exist add the element
        if (e === undefined) {
            var l = this._values.push(value);
            this._keys.set(key, l - 1);
        }
        else {
            // if the key is already there, update the value
            this._values[e] = value;
        }
        return this._values.length;
    };
    FastIterationMap.prototype.set = function (key, value) {
        return this.push(key, value);
    };
    FastIterationMap.prototype.swap = function (key1, key2) {
        var index1 = this._keys.get(key1);
        var index2 = this._keys.get(key2);
        if (index1 === undefined || index2 === undefined) {
            return false;
        }
        var tmp = this._values[index1];
        this._values[index1] = this._values[index2];
        this._values[index2] = tmp;
        this._keys.set(key1, index2);
        this._keys.set(key2, index1);
        return true;
    };
    FastIterationMap.prototype.insertValue = function (key, value, index) {
        return this._values.splice(index, 0, value);
    };
    // from exclusive
    // to exclusive
    FastIterationMap.prototype.offsetIndexInKeys = function (from, offsetVal, to) {
        var mapIter = this._keys.entries();
        var l = this._keys.size;
        to = to || Number.MAX_VALUE;
        for (var i = 0; i < l; ++i) {
            var e = mapIter.next().value;
            if (e[1] > from && e[1] < to) {
                this._keys.set(e[0], e[1] += offsetVal);
            }
        }
    };
    return FastIterationMap;
}());
exports.FastIterationMap = FastIterationMap;


/***/ })
/******/ ]);
});