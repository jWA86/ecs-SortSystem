(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ecs-framework"));
	else if(typeof define === 'function' && define.amd)
		define(["ecs-framework"], factory);
	else if(typeof exports === 'object')
		exports["ecs-sortsystem"] = factory(require("ecs-framework"));
	else
		root["ecs-sortsystem"] = factory(root["ecs-framework"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ecs_framework_1 = __webpack_require__(2);
/* Sort components in the pool by a parameter of type number */
var SortSystem = /** @class */ (function (_super) {
    __extends(SortSystem, _super);
    function SortSystem(params) {
        var _this = _super.call(this, params) || this;
        _this.sort = _this.insertionSort;
        return _this;
        // System.init won't set parametersSource since the parameter passed by the constructor and set from the System generic
        // this allow to change the parameter name to sort by at runtime without instantiating a new
        // this.parametersSource.set("paramName", { key: "paramName", source: undefined, keyInSource: paramNameToSortBy as keyof interfaces.IComponent });
    }
    SortSystem.prototype.process = function () {
        // const pool = this.factories[0];
        var paramInfo = this.parametersSource.get("paramName");
        var pool = paramInfo.source;
        var sortedIndex = this.sort(pool.values, pool.activeLength, paramInfo.keyInSource);
        var l = sortedIndex.length;
        for (var i = 0; i < sortedIndex.length; ++i) {
            var pId = pool.values[i].entityId;
            var sId = sortedIndex[i].id;
            if (sId !== pId) {
                pool.swap(pId, sId);
            }
        }
    };
    /* Not use as the sorting is done in the process method */
    SortSystem.prototype.execute = function () { };
    SortSystem.prototype.setParamSource = function (paramName, pool, paramNameInSource) {
        _super.prototype.setParamSource.call(this, "paramName", pool, paramNameInSource);
    };
    /* Return an array sorted in ascending order of id and the value of the sorting parameter */
    SortSystem.prototype.insertionSort = function (input, length, paramToSort) {
        var sorted = [];
        sorted.push({ id: input[0].entityId, s: input[0][paramToSort] });
        for (var i = 1; i < length; ++i) {
            var tmp = { id: input[i].entityId, s: input[i][paramToSort] };
            var k = i - 1;
            for (k; k >= 0 && (sorted[k].s > tmp.s); --k) {
                sorted[k + 1] = sorted[k];
            }
            sorted[k + 1] = tmp;
        }
        return sorted;
    };
    return SortSystem;
}(ecs_framework_1.System));
exports.SortSystem = SortSystem;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});