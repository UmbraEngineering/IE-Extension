DOM-Extension
=============

A tool to make it easier for developers to extend the DOM with new functionality (or to polyfill with old)

Basic Use
---------

```javascript
// Extend all inputs with a placeholder attribute using the following code
DOM.extend('input[placeholder]', function(input) {
	// ...
});
```

This tool is particularly useful for implementing polyfills as it will always call the function you give for newly created elements that match the selector. So, in the case above, if you create a new `input` like this:

```javascript
var input = document.createElement('input');
input.type = 'text';
input.value = '';
input.setAttribtue('placeholder', 'foo');
document.body.appendChild(input);
```

The new `input` will get your extension as well, automatically.
