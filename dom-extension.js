
// 
// DOM Extension Project
// 
// Author: James Brumond <james@jbrumond.me> (http://www.jbrumond.me)
// 
// -------------------------------------------------------------
// 
// The DOM Extenstion Project is a tool used for extending the DOM with new functionality
// using everything from standard methods, to deprecated functions, and dirty tricks to get
// the best support for live DOM extension.
// 

(function(window, document, undefined) {
	
	var DOM = window.DOM = { };

	// 
	// This is the main exposed function, used to create new behaviors
	// 
	DOM.extend = function(selector, func) {
		DOM.extend._with[DOM._determineMethod()](selector, func);
	};

	// 
	// Order of preference for extension methods
	// 
	DOM.methodPreference = ['behavior'];

	// 
	// Determines the method to use for extension
	// 
	DOM._method = null;
	DOM._determineMethod = function() {
		if (! DOM._method) {
			var support = { };
			forIn(DOM.extend._with, function(method, name) {
				support[name] = method.supported();
			});
			for (var i = 0, c = DOM.methodPreference.length; i < c; i++) {
				var method = DOM.methodPreference[i];
				if (support[method]) {
					DOM._method = method;
					break;
				}
			}
			if (! DOM._method) {
				throw new Error('DOM.extend - No known extension methods are supported for this client');
			}
		}

		return DOM._method;
	};

// -------------------------------------------------------------
	
	// 
	// Here we store the extension methods
	// 
	DOM.extend._with = { };
	
	// 
	// This is where we store functions for calls
	// 
	DOM.extend._functions = { };
	DOM.extend._call = function(selector, elem) {
		if (! elem._DOM) {
			elem._DOM = {processedFor: { }};
		}

		if (! elem._DOM.processedFor[selector]) {
			elem._DOM.processedFor[selector] = true;
			DOM.extend._functions[selector].call(elem, elem);
		}
	};

	// 
	// This function is used for extension using CSS behaviors (old IE)
	// 
	DOM.extend._with.behavior = function(selector, func) {
		if (! DOM.extend._functions[selector]) {
			DOM.extend._with.behavior.stylesheet().addRule(selector,
				'behavior:expression(DOM.extend._call("' + selector + '", this))'
			);
		}
	
		DOM.extend._functions[selector].push(func);
	};

	// 
	// Determine if extension by CSS behavior is supported
	// 
	DOM.extend._with.behavior.supported = function() {
		// TODO
		return true;
	};

	// 
	// Gets the first stylesheet in the document, or creates one if none exists
	// 
	DOM.extend._with.behavior.stylesheet = function() {
		if (! document.styleSheets.length) {
			var root = document.getElementsByTagName('head')[0] || document.documentElement;
			root.insertBefore(
				document.createElement('style'), root.lastChild
			);
		}
		
		return document.styleSheets[0];
	};

// -------------------------------------------------------------
	
	// 
	// DOM Extension type returned from DOM.extend(); Used for further extension based on
	// non-init events.
	// 
	function DomExtension() {
		// 
	}

	// 
	// Creates a listener for when a given attribute is modified on the extended element type
	// 
	DomExtension.prototype.attr = function(attr, func) {
		// TODO - Figure out how to actually do this...
		elem.onAttributeChange(attr, function(elem, value, old) {
			func.call(elem, elem, value, old);
		});
	};

// -------------------------------------------------------------
	
	function Callstack(funcs) {
		this.funcs = funcs || [ ];
		if (typeof this.funcs === 'function') {
			this.funcs = [ this.funcs ];
		}
	}

	Callstack.prototype.call = function(scope) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.apply(scope, args);
	};

	Callstack.prototype.apply = function(scope, args) {
		each(this.funcs, function(func) {
			func.apply(scope, args);
		});
	};

	Callstack.prototype.push = function() {
		this.funcs.push.apply(this.funcs, arguments);
	};

	Callstack.prototype.unshift = function() {
		this.funcs.unshift.apply(this.funcs, arguments);
	};

// -------------------------------------------------------------

	function each(arr, func) {
		if (arr.forEach) {
			return arr.forEach(func);
		}

		for (var i = 0, c = arr.length; i < c; i++) {
			func(arr[i], i, arr);
		}
	}

	function forIn(obj, func) {
		if (Object.keys) {
			return each(Object.keys(obj), function(key) {
				func(obj[key], key, obj);
			});
		}

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				func(obj[key], key, obj);
			}
		}
	}

}(window, document));