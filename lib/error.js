/*jslint node: true */
'use strict';

var util = require('util');

var exports = module.exports = {};

function BadConfig(message) {  
  Error.call(this);
  this.message = message;
}

function BadDownload(message) {  
  Error.call(this);
  this.message = message;
}

function BadUnzip(message) {  
  Error.call(this);
  this.message = message;
}

function BadJsonConversion(message) {  
  Error.call(this);
  this.message = message;
}

function BadDBImport(message) {  
  Error.call(this);
  this.message = message;
}

function UncategorizedError(message) {  
  Error.call(this);
  this.message = message;
}


util.inherits(BadConfig, Error);
util.inherits(BadDownload, Error);
util.inherits(BadUnzip, Error);
util.inherits(BadJsonConversion, Error);
util.inherits(BadDBImport, Error);
util.inherits(UncategorizedError, Error);

exports.BadConfig = BadConfig;
exports.BadDownload = BadDownload;
exports.BadUnzip = BadUnzip;
exports.BadJsonConversion = BadJsonConversion;
exports.BadDBImport = BadDBImport;
exports.UncategorizedError = UncategorizedError;