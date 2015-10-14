var math = require('../src/math.js')
var assert = require('chai').assert;

describe("math test", function () {
  it("should add sycn 2 + 3", function () {
    
    var result = math.addSync(2,3);
    
    assert.equal(result,5);
  });

  it("should add asycn 2 + 3", function () {
    
    math.addAsync(2,3, function(err, result){
      
      //console.log('err:'+ err);
      //console.log('result:' + result);
      assert.equal(result,5);
    });
    
  });

}); 