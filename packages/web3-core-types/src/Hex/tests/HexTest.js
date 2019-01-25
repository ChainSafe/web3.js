import Hex from '../Hex';

/**
 * Hex test
 */
describe('HexTest', () => {
    let hex;
    const error = {
        hex:
            "The 'hex' parameter needs to be a string composed of numbers and letters between 'a' and 'f'.\n" +
            "Use 'empty' to set a web3 empty hex object."
    };
    const initParams = {
        hex: undefined
    };

    beforeEach(() => {});

    it('constructor check', () => {
        hex = new Hex({hex: '0x0'}, error, initParams);

        expect(hex).toHaveProperty('error');
        expect(hex).toHaveProperty('props');
    });

    it('takes empty for empty hex', () => {
        hex = new Hex('empty', error, initParams);

        expect(hex).toHaveProperty('error');
        expect(hex).toHaveProperty('props');
    });

    it('takes string for constructor override', () => {
        hex = new Hex('0x12', error, initParams);

        expect(hex).toHaveProperty('error');
        expect(hex).toHaveProperty('props');
    });

    it('checks for strict hex', () => {
        const strict = new Hex('0x12', error, initParams).isStrict();
        const notStrict = new Hex('12', error, initParams).isStrict();

        expect(strict).toBe(true);
        expect(notStrict).toBe(false);
    });
});
