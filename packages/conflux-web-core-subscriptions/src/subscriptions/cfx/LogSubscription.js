/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import AbstractSubscription from '../../../lib/subscriptions/AbstractSubscription';
import isFunction from 'lodash/isFunction';

// TODO: carefully go over this code when adding log
// TODO: Move the past logs logic to the cfx module
export default class LogSubscription extends AbstractSubscription {
    /**
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {GetPastLogsMethod} getPastLogsMethod
     * @param {AbstractConfluxWebModule} moduleInstance
     *
     * @constructor
     */
    constructor(options, utils, formatters, moduleInstance, getPastLogsMethod) {
        super('eth_subscribe', 'logs', options, utils, formatters, moduleInstance);
        this.getPastLogsMethod = getPastLogsMethod;
    }

    /**
     * Sends the JSON-RPC request, emits the required events and executes the callback method.
     *
     * @method subscribe
     *
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Subscription} Subscription
     */
    subscribe(callback) {
        if ((this.options.fromBlock && this.options.fromBlock !== 'latest') || this.options.fromBlock === 0) {
            this.getPastLogsMethod.parameters = [this.formatters.inputLogFormatter(this.options)];
            this.getPastLogsMethod
                .execute()
                .then((logs) => {
                    logs.forEach((log) => {
                        const formattedLog = this.onNewSubscriptionItem(log);

                        if (isFunction(callback)) {
                            callback(false, formattedLog);
                        }

                        this.emit('data', formattedLog);
                    });

                    delete this.options.fromBlock;
                    super.subscribe(callback);
                })
                .catch((error) => {
                    if (isFunction(callback)) {
                        callback(error, null);
                    }

                    this.emit('error', error);
                });

            return this;
        }

        super.subscribe(callback);

        return this;
    }

    /**
     * This method will be executed on each new subscription item.
     *
     * @method onNewSubscriptionItem
     *
     * @param {Object} subscriptionItem
     *
     * @returns {Object}
     */
    onNewSubscriptionItem(subscriptionItem) {
        return this.formatters.outputLogFormatter(subscriptionItem);
    }
}
