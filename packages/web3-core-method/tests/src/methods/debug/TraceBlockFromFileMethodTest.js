import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import TraceBlockFromFileMethod from '../../../../src/methods/debug/TraceBlockFromFileMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * TraceBlockFromFileMethod test
 */
describe('TraceBlockFromFileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new TraceBlockFromFileMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_traceBlockFromFile');

        expect(method.parametersAmount).toEqual(2);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
