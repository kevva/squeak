'use strict';

var align = require('lpad-align');
var chalk = require('chalk');
var EventEmitter = require('events').EventEmitter;
var fmt = require('util').format;
var inherits = require('util').inherits;

/**
 * Initialize a new `Squeak`
 *
 * @param {Object} opts
 * @api public
 */

function Squeak(opts) {
	if (!(this instanceof Squeak)) {
		return new Squeak(opts);
	}

	EventEmitter.call(this);

	this.opts = opts || {};
	this.indent = this.opts.indent || 2;
	this.separator = this.opts.separator || ' : ';
	this.stream = this.opts.stream || process.stderr;
	this.types = [];
}

/**
 * Inherit from `EventEmitter`
 */

inherits(Squeak, EventEmitter);

/**
 * Write
 *
 * @api public
 */

Squeak.prototype.write = function () {
	this.log([].slice.call(arguments), null, 'reset');
	return this;
};

/**
 * Add type
 *
 * @param {String} type
 * @param {Object} opts
 * @param {Function} cb
 * @api public
 */

Squeak.prototype.type = function (type, opts, cb) {
	if (!cb && typeof opts === 'function') {
		cb = opts;
		opts = {};
	}

	opts = opts || {};

	var color = opts.color || 'reset';
	var prefix = opts.prefix || type;

	this.types.push(prefix);
	this[type] = function () {
		this.log([].slice.call(arguments), prefix, color);

		if (cb) {
			cb();
		}
	};

	return this;
};

/**
 * End
 *
 * @api public
 */

Squeak.prototype.end = function () {
	this.stream.write('\n');
	return this;
};

/**
 * Log
 *
 * @param {Array} args
 * @param {String} prefix
 * @param {String} color
 * @api private
 */

Squeak.prototype.log = function (args, prefix, color) {
	var msg = [fmt.apply(null, args)];

	if (prefix) {
		msg.unshift(chalk[color](align(prefix, this.types, this.indent)));
	}

	this.stream.write(msg.join(this.separator));
	this.stream.write('\n');

	return this;
};

/**
 * Module exports
 */

module.exports = Squeak;
