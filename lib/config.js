var customError = require("./error");
var fs = require("fs");

var exports = module.exports = {};

// verify good config file
// DFB:TODO - clean this up
// DFB:TODO - can't find a good way to validate json
exports.FileCheck = function (config, callback) {
	
	console.log(config);
	if (config ===undefined){
		callback(new customError.BadConfig("config===undefined"));
	} else {
		if(config.dataurl===undefined){
			callback(new customError.BadConfig("configFile.dataurl===undefined"));
		} else {
			if(config.country===undefined){
				callback(new customError.BadConfig("configFile.country===undefined"));
			} else {
				if (Array.isArray(config.country)===false){
					callback(new customError.BadConfig("configFile.country is not array"));
				} else {
					if(config.country.length===0){
						callback(new customError.BadConfig("configFile.country.length===0"));
					} else {
						if(config.datadirectory===undefined){
							callback(new customError.BadConfig("configFile.datadirectory===undefined"));
						}else{
							fs.lstat(config.datadirectory, function(err, status){
								if(status===undefined){
									callback(new customError.BadConfig("lstatSync status errored - " + err));
								} else {
									if (!status.isDirectory()) {
										callback(new customError.BadConfig("configFile.datadirectory is not directory"));
									} else {
										if(config.datastore===undefined){
											callback(new customError.BadConfig("configFile.datastore===undefined"));
										} else {
											callback(null, config);										
										}
									}
								}
							});										
						}
					}
				}
			}
		}
	}
};