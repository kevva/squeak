'use strict';

var Squeak = require('./');
var test = require('ava');

function newStream() {
	var stream = new require('stream').Writable();

	stream._write = function (data, enc, cb) {
		(this.data = this.data || []).push(data);
		cb();
	};

	return stream;
}

test('add type', function (t) {
	t.plan(1);

	var stream = newStream();
	var log = new Squeak({ stream: stream })
		.type('foo');

	t.assert(typeof log.type === 'function');
});

test('add type with callback', function (t) {
	t.plan(1);

	var called;
	var stream = newStream();
	var log = new Squeak({ stream: stream })
		.type('foo', function () {
			called = true;
		});

	log.foo('foo');
	t.assert(called);
});

test('format variadic arguments', function (t) {
	t.plan(1);

	var stream = newStream();
	var log = new Squeak({ stream: stream })
		.type('foo');

	log.foo('foo %s', 'bar');
	t.assert(/foo bar/.test(stream.data.toString()));
});

test('emit events', function (t) {
	t.plan(2);

	var called = {};
	var stream = newStream();
	var log = new Squeak({ stream: stream })
		.type('foo', function () {
			log.emit('foo');
		})
		.type('bar', function () {
			log.emit('bar');
		});

	log.on('foo', function () {
		called.a = true;
	});

	log.on('bar', function () {
		called.b = true;
	});

	log.foo('foo');
	log.bar('bar');

	t.assert(called.a);
	t.assert(called.b);
});
