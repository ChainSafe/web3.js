var assert = require('assert');
var Basic = require('./sources/Basic');
var utils = require('./helpers/test.utils');
var Web3 = utils.getWeb3();

describe('method.send [ @E2E ]', function() {
    var web3;
    var accounts;
    var basic;
    var instance;
    var options;

    var basicOptions = {
        data: Basic.bytecode,
        gasPrice: '1',
        gas: 4000000
    };

    describe('http', function() {
        before(async function(){
            web3 = new Web3('http://localhost:8545');
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            instance = await basic.deploy().send({from: accounts[0]});
        })

        it('returns a receipt', async function(){
            var receipt = await instance
                .methods
                .setValue('1')
                .send({from: accounts[0]});

            assert(receipt.status === true);
            assert(web3.utils.isHexStrict(receipt.transactionHash));
        });

        it('succeeds when using a perfect estimate', async function(){
            var estimate = await instance
                .methods
                .setValue('1')
                .estimateGas();

            var receipt = await instance
                .methods
                .setValue('1')
                .send({from: accounts[0], gas: estimate});

            assert(receipt.status === true);
        });

        it('errors on OOG', async function(){
            try {
                await instance
                    .methods
                    .setValue('1')
                    .send({from: accounts[0], gas: 100});

                assert.fail();

            } catch(err){
                assert(err.message.includes('gas'))
            }
        });

        it('errors on revert', async function(){
            try {
                await instance
                    .methods
                    .reverts()
                    .send({from: accounts[0]});

                assert.fail();

            } catch(err){
                var receipt = utils.extractReceipt(err.message);

                assert(err.message.includes('revert'))
                assert(receipt.status === false);
            }
        });
    });

    describe('ws', function() {
        // Websockets extremely erratic for geth instamine...
        if (process.env.GETH_INSTAMINE) return;

        before(async function(){
            var port = utils.getWebsocketPort();

            web3 = new Web3('ws://localhost:' + port);
            accounts = await web3.eth.getAccounts();

            basic = new web3.eth.Contract(Basic.abi, basicOptions);
            instance = await basic.deploy().send({from: accounts[0]});
        })

        it('returns a receipt', async function(){
            var receipt = await instance
                .methods
                .setValue('1')
                .send({from: accounts[0]});

            assert(receipt.status === true);
            assert(web3.utils.isHexStrict(receipt.transactionHash));
        });

        it('errors on OOG', async function(){
            try {
                await instance
                    .methods
                    .setValue('1')
                    .send({from: accounts[0], gas: 100});

                assert.fail();

            } catch(err){
                assert(err.message.includes('gas'))
            }
        });

        it('errors on revert', async function(){
            try {
                await instance
                    .methods
                    .reverts()
                    .send({from: accounts[0]});

                assert.fail();

            } catch(err){
                var receipt = utils.extractReceipt(err.message);

                assert(err.message.includes('revert'))
                assert(receipt.status === false);
            }
        });

        it('fires the transactionHash event', function(done){
            instance
                .methods
                .setValue('1')
                .send({from: accounts[0]})
                .on('transactionHash', hash => {
                    assert(web3.utils.isHex(hash))
                    done();
                })
        });

        it('fires the receipt event', function(done){
            instance
                .methods
                .setValue('1')
                .send({from: accounts[0]})
                .on('receipt', receipt => {
                    assert(receipt.status === true)
                    done();
                })
        })

        it('fires the confirmation handler', function(){
            return new Promise(async (resolve, reject) => {

                var startBlock = await web3.eth.getBlockNumber();

                await instance
                    .methods
                    .setValue('1')
                    .send({from: accounts[0]})
                    .on('confirmation', async (number, receipt) => {
                        if (number === 1) { // Confirmation numbers are zero indexed
                            var endBlock = await web3.eth.getBlockNumber();
                            assert(endBlock >= (startBlock + 2));
                            resolve();
                        }
                    })

                // Necessary for instamine, should not interfere with automine.
                await utils.mine(web3, accounts[0]);
            });
        });

        it('fires the error handler on OOG', function(done){
            instance
                .methods
                .setValue('1')
                .send({from: accounts[0], gas: 100})
                .on('error', err => {
                    assert(err.message.includes('gas'))
                    done();
                })
        })

        it('fires the error handler on revert', function(done){
            instance
                .methods
                .reverts()
                .send({from: accounts[0]})
                .on('error', err => {
                    assert(err.message.includes('revert'));
                    done();
                })
        })
    });
});

