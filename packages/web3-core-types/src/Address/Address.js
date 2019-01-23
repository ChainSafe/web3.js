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
 * @file Address.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

// TODO implement sha3 util
import sha3 from '../sha3';
import {cloneDeep, isBoolean} from 'lodash';

export default class Address {
    /**
     * @param {String} address
     * @param {boolean} isChecksummed
     *
     * @constructor
     */
    constructor(params, error /* from factory */, initParams /* from factory */) {
        this.error = error;
        this.initParams = initParams;
        this.params = cloneDeep(initParams);

        /* Check for type and format validity */
        this.params.address = /(0x)?([0-9a-fA-F]{40})/gm.test(params.address)
            ? params.address.replace(/(0x)([0-9a-fA-F]{40})/gm, '0x$2')
            : undefined;

        this.params.isChecksummed =
            isBoolean(params.isChecksummed) && (!params.isChecksummed || Address.isValidChecksum(params.address))
                ? params.isChecksummed
                : undefined;

        /* Throw if any parameter is still undefined */
        Object.keys(this.params).forEach((key) => {
            typeof this.params[key] === 'undefined' && this._throw(this.error[key]);
        });

        /* Make the params immutable */
        Object.freeze(params);
    }


    /* Class functions */

    /**
     * Check for a valid checksum if the address is supposed to be
     * checksummed
     *
     * @method isValidChecksum
     *
     * @param {String} address
     *
     * @returns {boolean}
     */
    static isValidChecksum(_address) {
        /* Remove the prefix in case it still has it */
        const address = _address.replace('0x', '');

        /* Hash the lowercased address, make it lowercase, and remove the prefix if present */
        const addressHash = sha3(address.toLowerCase())
            .toLowerCase()
            .replace('0x', '');

        /* If the hex digit is not a number, it must be uppercase if
         *  the first bit of the binary value of
         *  the corresponding index of the hash
         *  i.e. if the hex value is between 8 and f. (1___) */
        const isChecksummed = address.split('').every((v, i) => {
            return !/\d/gm.test(v) ? !/[8-9a-f]/gm.test(addressHash[i]) || /[A-F]/gm.test(v) : true;
        });

        return isChecksummed;
    }

    /**
     * Change an address to make it checksummed
     *
     * @method toChecksumAddress
     *
     * @param {Address} addressObj
     *
     * @returns {Address}
     */
    static toChecksumAddress(addressObj) {
        /* Remove the prefix in case it still has it */
        const address = addressObj.params.address.replace('0x', '');

        /* Hash the lowercased address, make it lowercase, and remove the prefix if present */
        const addressHash = sha3(address.toLowerCase())
            .toLowerCase()
            .replace('0x', '');

        /* If the hex digit is not a number, it must be uppercase if
         *  the first bit of the binary value of
         *  the corresponding index of the hash
         *  i.e. if the hex value is between 8 and f. (1___) */
        const checksummed = address
            .split('')
            .map((v, i) => {
                return !/\d/gm.test(v) && /[8-9a-f]/gm.test(addressHash[i]) ? v.toUpperCase() : v.toLowerCase();
            })
            .join('');

        return new Address(
            {
                ...addressObj.params,
                address: checksummed,
                isChecksummed: true
            },
            addressObj.error,
            addressObj.initParams
        );
    }


    /* Instance accessors  */

    /**
     * Change an address to make it checksummed
     *
     * @method toChecksumAddress
     *
     * @returns {Address}
     */
    toChecksumAddress() {
        return Address.toChecksumAddress(this);
    }
    
    /**
     * Check for a valid checksum of the caller
     *
     * @method isValidChecksum
     *
     * @returns {boolean}
     */
    isValidChecksum() {
        return Address.isValidChecksum(this.params.address);
    }


    _throw(message) {
        throw message;
    }
}
