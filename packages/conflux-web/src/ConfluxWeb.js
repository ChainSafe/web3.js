import {AbstractWeb3Module} from 'conflux-web-core';
import {ProviderDetector, ProvidersModuleFactory} from 'web3-providers';
import * as Utils from 'conflux-web-utils';
import {Eth} from 'conflux-web-cfx';
import {Network} from 'conflux-web-net';
import {version} from '../package.json';

export default class ConfluxWeb extends AbstractWeb3Module {
    /**
     * @param {AbstractSocketProvider|HttpProvider|CustomProvider|String} provider
     * @param {Net} net
     * @param {Object} options
     *
     * @constructor
     */
    constructor(provider, net, options = {}) {
        super(provider, options, null, net);

        this.eth = new Eth(this.currentProvider, net, options);
        this.utils = Utils;
        this.version = version;
    }

    /**
     * Sets the defaultGasPrice property on the eth module
     *
     * @property defaultGasPrice
     *
     * @param {String} value
     */
    set defaultGasPrice(value) {
        super.defaultGasPrice = value;
        this.eth.defaultGasPrice = value;
    }

    /**
     * Gets the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @returns {String|Number} value
     */
    get defaultGasPrice() {
        return super.defaultGasPrice;
    }

    /**
     * Sets the defaultGas property on the eth module
     *
     * @property defaultGas
     *
     * @param {Number} value
     */
    set defaultGas(value) {
        super.defaultGas = value;
        this.eth.defaultGas = value;
    }

    /**
     * Gets the defaultGas property
     *
     * @property defaultGas
     *
     * @returns {String|Number} value
     */
    get defaultGas() {
        return super.defaultGas;
    }

    /**
     * Sets the transactionBlockTimeout property on all contracts and on all sub-modules
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} value
     */
    set transactionBlockTimeout(value) {
        super.transactionBlockTimeout = value;
        this.eth.transactionBlockTimeout = value;
    }

    /**
     * Gets the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @returns {Number} value
     */
    get transactionBlockTimeout() {
        return super.transactionBlockTimeout;
    }

    /**
     * Sets the transactionConfirmationBlocks property on all contracts and on all sub-modules
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionConfirmationBlocks(value) {
        super.transactionConfirmationBlocks = value;
        this.eth.transactionConfirmationBlocks = value;
    }

    /**
     * Gets the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @returns {Number} value
     */
    get transactionConfirmationBlocks() {
        return super.transactionConfirmationBlocks;
    }

    /**
     * Sets the transactionConfirmationBlocks property on all contracts and on all sub-modules
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} value
     */
    set transactionPollingTimeout(value) {
        super.transactionPollingTimeout = value;
        this.eth.transactionPollingTimeout = value;
    }

    /**
     * Gets the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @returns {Number} value
     */
    get transactionPollingTimeout() {
        return super.transactionPollingTimeout;
    }

    /**
     * Sets the defaultAccount property on the eth module
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        super.defaultAccount = value;
        this.eth.defaultAccount = value;
    }

    /**
     * Gets the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {String} value
     */
    get defaultAccount() {
        return super.defaultAccount;
    }

    /**
     * Sets the defaultBlock property on the eth module
     *
     * @property defaultBlock
     *
     * @param {Number|String} value
     */
    set defaultBlock(value) {
        super.defaultBlock = value;
        this.eth.defaultBlock = value;
    }

    /**
     * Gets the defaultBlock property
     *
     * @property defaultBlock
     *
     * @returns {String|Number} value
     */
    get defaultBlock() {
        return super.defaultBlock;
    }

    /**
     * Sets the provider for all packages
     *
     * @method setProvider
     *
     * @param {Object|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return super.setProvider(provider, net) && this.eth.setProvider(provider, net);
    }

    /**
     * Returns the detected provider
     *
     * @returns {Object}
     */
    static get givenProvider() {
        return ProviderDetector.detect();
    }

    /**
     * Returns an object with all public web3 modules
     *
     * @returns {Object}
     */
    static get modules() {
        const providerResolver = new ProvidersModuleFactory().createProviderResolver();

        return {
            Eth: (provider, options, net) => {
                return new Eth(providerResolver.resolve(provider, net), options);
            },
            Net: (provider, options, net) => {
                return new Network(providerResolver.resolve(provider, net), options);
            }
        };
    }
}
