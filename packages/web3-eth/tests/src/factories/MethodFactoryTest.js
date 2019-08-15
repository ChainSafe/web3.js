import {
    CallMethod,
    ChainIdMethod,
    EstimateGasMethod,
    EthSendTransactionMethod,
    GetBalanceMethod,
    GetBlockNumberMethod,
    GetCodeMethod,
    GetCoinbaseMethod,
    GetGasPriceMethod,
    GetHashrateMethod,
    GetNodeInfoMethod,
    GetPastLogsMethod,
    GetProtocolVersionMethod,
    GetStorageAtMethod,
    GetTransactionCountMethod,
    GetTransactionMethod,
    GetPendingTransactionsMethod,
    GetTransactionReceiptMethod,
    GetWorkMethod,
    IsMiningMethod,
    IsSyncingMethod,
    RequestAccountsMethod,
    SendRawTransactionMethod,
    SubmitWorkMethod,
    VersionMethod,
    GetProofMethod
} from 'web3-core-method';
import MethodFactory from '../../../src/factories/MethodFactory';
import GetBlockMethod from '../../../src/methods/GetBlockMethod';
import GetUncleMethod from '../../../src/methods/GetUncleMethod';
import GetBlockTransactionCountMethod from '../../../src/methods/GetBlockTransactionCountMethod';
import GetBlockUncleCountMethod from '../../../src/methods/GetBlockUncleCountMethod';
import GetTransactionFromBlockMethod from '../../../src/methods/GetTransactionFromBlockMethod';
import EthSignTransactionMethod from '../../../src/methods/EthSignTransactionMethod';
import EthSignMethod from '../../../src/methods/EthSignMethod';
import EthGetAccountsMethod from '../../../src/methods/EthGetAccountsMethod';

/**
 * MethodFactory test
 */
describe('MethodFactoryTest', () => {
    let methodFactory;

    beforeEach(() => {
        methodFactory = new MethodFactory();
    });

    it('constructor check', () => {
        expect(methodFactory.methods).toEqual({
            getNodeInfo: GetNodeInfoMethod,
            getProtocolVersion: GetProtocolVersionMethod,
            getCoinbase: GetCoinbaseMethod,
            isMining: IsMiningMethod,
            getHashrate: GetHashrateMethod,
            isSyncing: IsSyncingMethod,
            getGasPrice: GetGasPriceMethod,
            getAccounts: EthGetAccountsMethod,
            getBlockNumber: GetBlockNumberMethod,
            getBalance: GetBalanceMethod,
            getStorageAt: GetStorageAtMethod,
            getCode: GetCodeMethod,
            getBlock: GetBlockMethod,
            getUncle: GetUncleMethod,
            getBlockTransactionCount: GetBlockTransactionCountMethod,
            getBlockUncleCount: GetBlockUncleCountMethod,
            getTransaction: GetTransactionMethod,
            getPendingTransactions: GetPendingTransactionsMethod,
            getTransactionFromBlock: GetTransactionFromBlockMethod,
            getTransactionReceipt: GetTransactionReceiptMethod,
            getTransactionCount: GetTransactionCountMethod,
            sendSignedTransaction: SendRawTransactionMethod,
            signTransaction: EthSignTransactionMethod,
            sendTransaction: EthSendTransactionMethod,
            sign: EthSignMethod,
            call: CallMethod,
            estimateGas: EstimateGasMethod,
            submitWork: SubmitWorkMethod,
            getWork: GetWorkMethod,
            getPastLogs: GetPastLogsMethod,
            requestAccounts: RequestAccountsMethod,
            getChainId: ChainIdMethod,
            getId: VersionMethod,
            getProof: GetProofMethod
        });
    });
});
