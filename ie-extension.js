
// 
// IE Extension Project
// 
// Author: James Brumond <james@jbrumond.me> (http://www.jbrumond.me)
// 
// -------------------------------------------------------------
// 
// The IE Extenstion Project is a tool used for extending old IE with new functionality.
// 

(function(window, document, undefined) {
	
	var IE = window.IE = { };

	// 
	// This is the main exposed function, used to create new behaviors
	// 
	IE.extend = function(selector, func) {
		IE.extend._with[IE._determineMethod()](selector, func);
	};

	// 
	// Order of preference for extension methods
	// 
	IE.methodPreference = ['behavior'];

	// 
	// Determines the method to use for extension
	// 
	IE._method = null;
	IE._determineMethod = function() {
		if (! IE._method) {
			var support = { };
			forIn(IE.extend._with, function(method, name) {
				support[name] = method.supported();
			});
			for (var i = 0, c = IE.methodPreference.length; i < c; i++) {
				var method = IE.methodPreference[i];
				if (support[method]) {
					IE._method = method;
					break;
				}
			}
			if (! IE._method) {
				throw new Error('IE.extend - No known extension methods are supported for this client');
			}
		}

		return IE._method;
	};

// -------------------------------------------------------------
	
	// 
	// Here we store the extension methods
	// 
	IE.extend._with = { };
	
	// 
	// This is where we store functions for calls
	// 
	IE.extend._functions = { };
	IE.extend._call = function(selector, elem) {
		if (! elem._DOM) {
			elem._DOM = {processedFor: { }};
		}

		if (! elem._IE.processedFor[selector]) {
			elem._IE.processedFor[selector] = true;
			IE.extend._functions[selector].call(elem, elem);
		}
	};

	// 
	// This function is used for extension using CSS behaviors (old IE)
	// 
	IE.extend._with.behavior = function(selector, func) {
		if (! IE.extend._functions[selector]) {
			IE.extend._with.behavior.stylesheet().addRule(selector,
				'behavior:expression(IE.extend._call("' + selector + '", this))'
			);
		}
	
		IE.extend._functions[selector].push(func);
	};

	// 
	// Determine if extension by CSS behavior is supported
	// 
	IE.extend._with.behavior.supported = function() {
		// TODO
		return true;
	};

	// 
	// Gets the first stylesheet in the document, or creates one if none exists
	// 
	IE.extend._with.behavior.stylesheet = function() {
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
	// DOM Extension type returned from IE.extend(); Used for further extension based on
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