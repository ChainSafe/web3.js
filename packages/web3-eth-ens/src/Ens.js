/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file Ens.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module} from 'web3-core';
import {isFunction} from 'lodash';
import namehash from 'eth-ens-namehash';

export default class Ens extends AbstractWeb3Module {
    /**
     * @param {HttpProvider|WebsocketProvider|IpcProvider|EthereumProvider|String} provider
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {MethodModuleFactory} methodModuleFactory
     * @param {Object} options
     * @param {EnsModuleFactory} ensModuleFactory
     * @param {PromiEvent} promiEvent
     * @param {AbiCoder} abiCoder
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Object} registryOptions
     * @param {Network} net
     *
     * @constructor
     */
    constructor(
        provider,
        providersModuleFactory,
        methodModuleFactory,
        options,
        ensModuleFactory,
        promiEvent,
        abiCoder,
        utils,
        formatters,
        registryOptions,
        net
    ) {
        super(provider, providersModuleFactory, methodModuleFactory, null, options);

        this.ensModuleFactory = ensModuleFactory;
        this.promiEvent = promiEvent;
        this.abiCoder = abiCoder;
        this.utils = utils;
        this.formatters = formatters;
        this.registryOptions = registryOptions;
        this.net = net;
        this._registry = false;
    }

    /**
     * Getter for the registry property
     *
     * @property registry
     *
     * @returns {Registry}
     */
    get registry() {
        if (!this._registry) {
            this._registry = this.ensModuleFactory.createRegistry(
                this.currentProvider,
                this.providersModuleFactory,
                this.methodModuleFactory,
                this.contractModuleFactory,
                this.promiEvent,
                this.abiCoder,
                this.utils,
                this.formatters,
                this.registryOptions,
                this.net
            );
        }

        return this._registry;
    }

    /**
     * Sets the provider for the registry and resolver object.
     * This method will also set the provider in the NetworkPackage and AccountsPackage because they are used here.
     *
     * @method setProvider
     *
     * @param {HttpProvider|WebsocketProvider|IpcProvider|EthereumProvider|String} provider
     * @param {Net} net
     *
     * @returns {Boolean}
     */
    setProvider(provider, net) {
        return !!(super.setProvider(provider, net) && this.registry.setProvider(provider, net));
    }

    /**
     * Returns an contract of type resolver
     *
     * @method resolver
     *
     * @param {String} name
     *
     * @returns {Promise<AbstractContract>}
     */
    resolver(name) {
        return this.registry.resolver(name);
    }

    /**
     * Returns the address record associated with a name.
     *
     * @method getAddress
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async getAddress(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.addr().call(callback);
    }

    /**
     * Sets a new address
     *
     * @method setAddress
     *
     * @param {String} name
     * @param {String} address
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setAddress(name, address, sendOptions, callback = null) {
        const promiEvent = new this.registry.PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setAddr(namehash.hash(name), address)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
    }

    /**
     * Returns the public key
     *
     * @method getPubkey
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async getPubkey(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.pubkey().call(callback);
    }

    /**
     * Set the new public key
     *
     * @method setPubkey
     *
     * @param {String} name
     * @param {String} x
     * @param {String} y
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setPubkey(name, x, y, sendOptions, callback = null) {
        const promiEvent = new this.registry.PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setPubkey(namehash.hash(name), x, y)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
    }

    /**
     * Returns the content
     *
     * @method getContent
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async getContent(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.content().call(callback);
    }

    /**
     * Set the content
     *
     * @method setContent
     *
     * @param {String} name
     * @param {String} hash
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setContent(name, hash, sendOptions, callback = null) {
        const promiEvent = new this.registry.PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setContent(namehash.hash(name), hash)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
    }

    /**
     * Get the multihash
     *
     * @method getMultihash
     *
     * @param {String} name
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Promise<String>}
     */
    async getMultihash(name, callback = null) {
        const resolver = await this.registry.resolver(name);

        return resolver.methods.multihash().call(callback);
    }

    /**
     * Set the multihash
     *
     * @method setMultihash
     *
     * @param {String} name
     * @param {String} hash
     * @param {Object} sendOptions
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    setMultihash(name, hash, sendOptions, callback = null) {
        const promiEvent = new this.registry.PromiEvent();

        this.registry.resolver(name).then((resolver) => {
            resolver.methods
                .setMultihash(namehash.hash(name), hash)
                .send(sendOptions, callback)
                .on('transactionHash', (transactionHash) => {
                    promiEvent.emit('transactionHash', transactionHash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    promiEvent.emit('confirmation', confirmationNumber, receipt);
                })
                .on('receipt', (receipt) => {
                    if (isFunction(callback)) {
                        callback(receipt);
                    }

                    promiEvent.emit('receipt', receipt);
                    promiEvent.resolve(receipt);
                })
                .on('error', (error) => {
                    if (isFunction(callback)) {
                        callback(error);
                    }

                    promiEvent.emit('error', error);
                    promiEvent.reject(error);
                });
        });

        return promiEvent;
    }
}
