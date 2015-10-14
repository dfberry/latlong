var addSync = function(a, b){
		return a + b;
}

var addAsync = function(a,b,callback){
		callback(null, a + b);
}

module.exports = {
	addSync: addSync,
	addAsync: addAsync
}