var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../src/index.js');
var web3 = new Web3();

var tests = [{
    params: [['uint256','string'], ['2345675643', 'Hello!%']],
    result: '0x000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000'
},{
    params: [['uint8[]','bytes32'], [['34','434'], '0x324567fff']],
    result: '0x0000000000000000000000000000000000000000000000000000000000000040324567fff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000001b2'
},{
    params: [['address','address','address', 'address'], ['0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1','','0x0', null]],
    result: '0x00000000000000000000000090f8bf6a479f320ead074411a4b0e7944ea8c9c1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
}];

describe('encodeParameters', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.equal(web3.eth.abi.encodeParameters.apply(web3.eth.abi, test.params), test.result);
        });
    });
});
