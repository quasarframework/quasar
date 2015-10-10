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
	    //
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
	
	module.exports = function() {
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
	
	module.exports = function() {
	    console.log('wow');
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTBkNjkzODM0NTNjZGYxNDYzN2IiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3F1YXNhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLGFBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxTQUFTO0FBQ3JCLGFBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsVUFBUyxPQUFPO0FBQ2hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBWSxVQUFVO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHIiwiZmlsZSI6InF1YXNhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMTBkNjkzODM0NTNjZGYxNDYzN2JcbiAqKi8iLCIvKipcbiAqIFBhbnRzIG1vZHVsZS5cbiAqIEBtb2R1bGUgbXkvcGFudHNcbiAqIEBzZWUgbW9kdWxlOm15L3NoaXJ0XG4gKi9cblxucmVxdWlyZSgnLi90ZXN0LmpzJyk7XG5jb25zb2xlLmxvZygnbG9hZGVkJyk7XG5cbndpbmRvdy5hID0gJ2EnO1xuXG4vKipcbiAqIFt3b3cgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IGdlZSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IGd1eCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIHdvdyhnZWUsIGd1eCkge1xuICAgIC8vXG4gICAgcmV0dXJuIGdlZTtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSBhIHdlZSBlZmZlY3RcbiAqIEBwYXJhbSAge1N0cmluZ30gdmVyc2lvbiB2ZXJzaW9uIHRvIG91dHB1dFxuICogQHBhcmFtICB7RnVuY3Rpb259IHZhcmF4ICAgdmFyYXggc2VydmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgdmVyc2lvblxuICovXG5mdW5jdGlvbiB3ZWUodmVyc2lvbiwgdmFyYXgpIHtcbiAgICAvKioge051bWJlcn0gZ2VlLCB3ZWUsIGZvbyB2YXJpYWJsZSAqL1xuICAgIHZhciBmb28gPSAxO1xuXG4gICAgZm9vKys7XG4gICAgaWYgKHZhcmF4KSB7XG4gICAgXHR2YXJheCsrO1xuICAgIH1cblxuICAgIHJldHVybiB2ZXJzaW9uO1xufVxuXG53b3coKTtcbndlZSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZygnd2FhYScpO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3F1YXNhci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogUSBtb2R1bGUuXG4gKiBAbW9kdWxlIG15L3FcbiAqIEBzZWUgbW9kdWxlOm15L3FcbiAqL1xuY29uc29sZS5sb2coJ3dvdycpO1xuXG4vKipcbiAqIGNhbGxtZSBhbmQgb25seSBtZVxuICogQHJldHVybiB7dW5kZWZpbmVkfSBub3RoaW5nXG4gKi9cbmZ1bmN0aW9uIGNhbGxtZSgpIHtcbiAgICAvL1xufVxuXG5jYWxsbWUoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnd293Jyk7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvdGVzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=