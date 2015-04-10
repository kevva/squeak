'use strict';

var test = require('ava');
var Squeak = require('./');

function newStream() {
	var stream = new require('stream').Writable();

	stream._write = function (data, enc, cb) {
		(this.data = this.data || []).push(data);
		cb();
	};

	return stream;
}

test('use a custom separator', function (t) {
	t.plan(1);

	var stream = newStream();
	var log = new Squeak({
		separator: ' - ',
		stream: stream
	});

	log.type('foo');
	log.foo('bar');

	t.assert(/ - /.test(stream.data.toString()));
});

test('customize indent', function (t) {
	t.plan(1);

	var stream = newStream();
	var log = new Squeak({
		indent: 4,
		stream: stream
	});

	log.type('foo');
	log.foo('bar');

	t.assert(/    foo/.test(stream.data.toString()));
});

test('remove align', function (t) {
	t.plan(1);

	var stream = newStream();
	var log = new Squeak({
		align: false,
		stream: stream
	});

	log.type('foo');
	log.type('foobar');
	log.foo('bar');

	t.assert(/  foo/.test(stream.data.toString()));
});

test('add type', function (t) {
	t.plan(2);

	var stream = newStream();
	var log = new Squeak({stream: stream})
		.type('foo');

	t.assert(log.types.length === 1);
	t.assert(typeof log.type === 'function');
});

test('add type with custom prefix', function (t) {
	t.plan(1);

	var stream = newStream();
	var log = new Squeak({stream: stream})
		.type('foo', {prefix: 'bar'});

	log.foo('foo');
	t.assert(/bar/.test(stream.data.toString()));
});

test('add type with callback', function (t) {
	t.plan(1);

	var called;
	var stream = newStream();
	var log = new Squeak({stream: stream})
		.type('foo', function () {
			called = true;
		});

	log.foo('foo');
	t.assert(called);
});

test('format variadic arguments', function (t) {
	t.plan(1);

	var stream = newStream();
	var log = new Squeak({stream: stream})
		.type('foo');

	log.foo('foo %s', 'bar');
	t.assert(/foo bar/.test(stream.data.toString()));
});

test('write with padding', function (t) {
	t.plan(1);

	var stream = newStream();
	var log = new Squeak({stream: stream});

	log.writelpad('foo');
	t.assert(/  foo/.test(stream.data.toString()));
});

test('emit events', function (t) {
	t.plan(1);

	function emit() {
		i++;
	}

	var i = 0;
	var stream = newStream();
	var log = new Squeak({stream: stream})
		.type('foo', function () {
			log.emit('foo');
		})
		.type('bar', function () {
			log.emit('bar');
		});

	log.on('foo', emit);
	log.on('bar', emit);
	log.foo('foo');
	log.bar('bar');

	t.assert(i === 2);
});
