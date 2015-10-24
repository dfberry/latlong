/*jslint node: true */
'use strict';

var util = require('util');

var exports = module.exports = {};

function BadConfig(message) {  
  Error.call(this);
  this.message = message;
}

util.inherits(BadConfig, Error);

exports.BadConfig = BadConfig;