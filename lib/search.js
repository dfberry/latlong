/*jslint node: true */
'use strict';

var exports = module.exports = {};

var Q = require("q");
var MongoClient = require('mongodb').MongoClient;
 
// Use connect method to connect to the Server 
// connectionObject.url example 'mongodb://url:port/db'
// connectionOjbect.collection example 'geoZip'
// connectionObject.user example 'bob'
// connectionObject.pwd example '1234'
// searchObject example {FIELD5:'WA'}
var find = function(connectionObject, searchObject, callback){

	MongoClient.connect(connectionObject.url, function(err, db) {
		db.authenticate(connectionObject.user,connectionObject.pwd, function(err, authResult){
			db.collection(connectionObject.collection, function(err,collectionResult){
				if (collectionResult !== undefined){
					collectionResult.find(searchObject, function(err,cursor){
						cursor.toArray(function(err,docs){
							db.close();	
							callback(docs);
	
						});
					});	
				}
				else{
					callback(null);
				}	
			});
			
		});
	});
};

exports.Fields = function Fields(connectionObject, callback){
	
	// setup callback into promise
	var deferred = Q.defer();
	deferred.promise.nodeify(callback);
		
	// get ojbect which has column names
	var searchObject = {"FIELD1": "countrycode"};
	
	find(connectionObject,searchObject, function(jsonResult){
		deferred.resolve(jsonResult);
	});
	
	return deferred.promise;
};

exports.ByTerm = function ByTerm(configFile, searchTerm, searchValue, callback) {
	
	// setup callback into promise
	var deferred = Q.defer();
	deferred.promise.nodeify(callback);

	var searchObject = {};
	searchObject[searchTerm] = searchValue;

	// DO WORK HERE
	find(configFile,searchObject, function(jsonResult){
		deferred.resolve(jsonResult);
	});
	
	return deferred.promise;	
};