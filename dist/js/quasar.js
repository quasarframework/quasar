/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Pants module.
	 * @module my/pants
	 * @see module:my/shirt
	 */
	
	__webpack_require__(2);
	console.log('loaded');
	
	window.a = 'a';
	
	/**
	 * [wow description]
	 * @param  {[type]} gee [description]
	 * @param  {[type]} gux [description]
	 * @return {[type]}     [description]
	 */
	function wow(gee, gux) {
	    if (gux) {
	        gux++;
	    }
	
	    return gee;
	}
	
	/**
	 * Generate a wee effect
	 * @param  {String} version version to output
	 * @param  {Function} varax   varax server
	 * @return {String}         version
	 */
	function wee(version, varax) {
	    /** {Number} gee, wee, foo variable */
	    var foo = 1;
	
	    foo++;
	    if (varax) {
	        varax++;
	    }
	
	    return version;
	}
	
	wow();
	wee();
	
	exports = function() {
	    console.log('waaa');
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Q module.
	 * @module my/q
	 * @see module:my/q
	 */
	console.log('wow');
	
	/**
	 * callme and only me
	 * @return {undefined} nothing
	 */
	function callme() {
	    //
	}
	
	callme();
	
	exports = function() {
	    console.log('wow');
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTk1ZDYyMGZkZTc1NmRhNTEyMWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3F1YXNhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLGFBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQVksT0FBTztBQUNuQixhQUFZLFNBQVM7QUFDckIsYUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxVQUFTLE9BQU87QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHOzs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFZLFVBQVU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEciLCJmaWxlIjoicXVhc2FyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAxOTVkNjIwZmRlNzU2ZGE1MTIxYVxuICoqLyIsIi8qKlxuICogUGFudHMgbW9kdWxlLlxuICogQG1vZHVsZSBteS9wYW50c1xuICogQHNlZSBtb2R1bGU6bXkvc2hpcnRcbiAqL1xuXG5yZXF1aXJlKCcuL3Rlc3QuanMnKTtcbmNvbnNvbGUubG9nKCdsb2FkZWQnKTtcblxud2luZG93LmEgPSAnYSc7XG5cbi8qKlxuICogW3dvdyBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gZ2VlIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gZ3V4IFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gd293KGdlZSwgZ3V4KSB7XG4gICAgaWYgKGd1eCkge1xuICAgICAgICBndXgrKztcbiAgICB9XG5cbiAgICByZXR1cm4gZ2VlO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIGEgd2VlIGVmZmVjdFxuICogQHBhcmFtICB7U3RyaW5nfSB2ZXJzaW9uIHZlcnNpb24gdG8gb3V0cHV0XG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gdmFyYXggICB2YXJheCBzZXJ2ZXJcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICB2ZXJzaW9uXG4gKi9cbmZ1bmN0aW9uIHdlZSh2ZXJzaW9uLCB2YXJheCkge1xuICAgIC8qKiB7TnVtYmVyfSBnZWUsIHdlZSwgZm9vIHZhcmlhYmxlICovXG4gICAgdmFyIGZvbyA9IDE7XG5cbiAgICBmb28rKztcbiAgICBpZiAodmFyYXgpIHtcbiAgICAgICAgdmFyYXgrKztcbiAgICB9XG5cbiAgICByZXR1cm4gdmVyc2lvbjtcbn1cblxud293KCk7XG53ZWUoKTtcblxuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCd3YWFhJyk7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvcXVhc2FyLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBRIG1vZHVsZS5cbiAqIEBtb2R1bGUgbXkvcVxuICogQHNlZSBtb2R1bGU6bXkvcVxuICovXG5jb25zb2xlLmxvZygnd293Jyk7XG5cbi8qKlxuICogY2FsbG1lIGFuZCBvbmx5IG1lXG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9IG5vdGhpbmdcbiAqL1xuZnVuY3Rpb24gY2FsbG1lKCkge1xuICAgIC8vXG59XG5cbmNhbGxtZSgpO1xuXG5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ3dvdycpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3Rlc3QuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9