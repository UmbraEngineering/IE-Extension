IE-Extension
=============

A tool to make it easier for developers to extend old Internet Explorer with new features

Basic Use
---------

```javascript
// Extend all inputs using the following code
IE.extend('input', function(input) {
	// Do something with every input
});
```

This tool is particularly useful for implementing polyfills as it will always call the function you give for newly created elements that match the selector. So, in the case above, if you create a new `input` like this:

```javascript
var input = document.createElement('input');
input.type = 'text';
document.body.appendChild(input);
```

The new `input` will get your extension as well, automatically.
