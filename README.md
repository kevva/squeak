# squeak [![Build Status](http://img.shields.io/travis/kevva/squeak.svg?style=flat)](https://travis-ci.org/kevva/squeak)

> A tiny stream log

![](https://cloud.githubusercontent.com/assets/709159/5165451/f0ca124e-73e4-11e4-8a49-9e278b7aff16.png)

## Install

```sh
$ npm install --save squeak
```

## Usage

```js
var Squeak = require('squeak');
var log = new Squeak({ separator: ' ' });

log.type('success', { color: 'green', prefix: '✔' });
log.type('warn', { color: 'yellow', prefix: '⚠' });
log.type('error', { color: 'red', prefix: '✖' }, function () {
	log.end();
	process.exit(1);
});

log.success('this is a success message');
log.warn('this is a warning');
log.error(new Error('this is an error').stack);

/*
  ✔ this is a success message
  ⚠ this is a warning
  ✖ this is an error
  at ChildProcess.exithandler (child_process.js:648:15)
  at ChildProcess.emit (events.js:98:17)
 */
```

## API

### new Squeak(options)

Type: `Object`

Creates a new `Squeak` instance with [options](#options).

### .write(message)

Writes to `options.stream`, using `process.stderr` by default.

### .type(type, options, callback)

Adds a type.

#### type

Type: `String`

The name of the type. Will be used as `prefix` by default.

#### options

Type: `Object`

Customize your type with a `color` and a `prefix`.

* `color`: Sets the prefix color. Supported colors can be found [here](https://github.com/sindresorhus/ansi-styles#colors).
* `prefix`: Sets the `type` prefix. Uses `type` as default.

#### cb

Type: `Function`

An optional callback to be called when the `type` is called.

### .emit(event, data)

Emits an event.

### .end()

Writes a newline.

## Options

### indent

Type: `Number`  
Default: `2`

Sets the indentation.

### separator

Type: `String`  
Default: ` : `

Customize the separator between the `prefix` and the message.

### stream

Type: `Stream`  
Default: `process.stderr`

Which `stream` to write to.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
