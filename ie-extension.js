
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
	
	var IE = window.IE = {
		// Make the version of IE available
		version: (function() {
			var undef;
			var v = 3;
			var div = document.createElement('div');
			var all = div.getElementsByTagName('i');

			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			);

			return v > 4 ? v : undef;
		}())
	};

	// 
	// This is the main exposed function, used to create new behaviors
	// 
	IE.extend = function(selector, func) {
		IE.extend._with.behavior(selector, func);
	};

// -------------------------------------------------------------
	
	// 
	// Here we store the extension methods
	// 
	IE.extend._with = { };
	
	// 
	// This is where we store functions for calls
	// 
	IE.extend._extensions = { };
	IE.extend._callInit = function(selector, elem) {
		if (! elem._IE) {
			elem._IE = ';';
		}

		if (elem._IE.indexOf(';' + selector + ';') < 0) {
			elem._IE += selector + ';';
			IE.extend._extensions[selector].init.call(elem, elem);
		}
	};

	// 
	// This function is used for extension using CSS behaviors (old IE)
	// 
	IE.extend._with.behavior = function(selector, func) {
		if (! IE.extend._extensions[selector]) {
			IE.extend._extensions[selector] = new Extension();
			IE.extend._with.behavior.stylesheet().addRule(selector,
				'behavior:expression(IE.extend._callInit("' + selector + '", this))'
			);
		}
	
		IE.extend._extensions[selector].init.push(func);
	};

	// 
	// Determine if extension by CSS behavior is supported
	// 
	IE.extend._with.behavior.supported = function() {
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
	// Extension type returned from IE.extend(); Used for further extension based on
	// non-init events.
	// 
	function Extension() {
		this.init = new Callstack();
	}

	// 
	// Creates a listener for when a given attribute is modified on the extended element type
	// 
	Extension.prototype.attr = function(attr, func) {
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