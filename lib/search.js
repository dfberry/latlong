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

	console.log("db-mongo::find");
	//console.log(connectionObject);
	//console.log(searchObject);

	MongoClient.connect(connectionObject.url, function(err, db) {
		
		console.log("db");
		//console.log(db);
		
		db.authenticate(connectionObject.user,connectionObject.pwd, function(err, authResult){
			
			console.log("authResult");
			//console.log(authResult);

			db.collection(connectionObject.collection, function(err,collectionResult){

				console.log("collectionResult");				
				//console.log(collectionResult);

				if (collectionResult !== undefined){
					
								
					collectionResult.find(searchObject, function(err,cursor){
						
						console.log("cursor");
						//console.log(cursor);
						
					
						cursor.toArray(function(err,docs){
							
							console.log("docs");
							//console.log(docs);
							
							db.close();	
							callback(docs);
	
						});
					});	
				}
				else{
					
					console.log("collectionResult is empty");
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
		
		if (jsonResult.length==1){
			var p=jsonResult[0];
			delete p._id;
			//callback(p);
			console.log("db-mongo::fields - done");
			deferred.resolve(p);

		} else {
			console.log("db-mongo::fields - done");
			callback(jsonResult);
			deferred.reject(jsonResult);
 		}
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