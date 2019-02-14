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
 * @file index.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import AddressFactory from './factories/AddressFactory';
import AddressClass from './Address';
import Iban from './Iban';

/**
 * Returns an object of Address
 *
 * @returns {Address}
 *
 * @constructor
 */
export const Address = (params) => {
    return new AddressFactory().createAddress(params);
};

/**
 * Copy isValid class method and expose
 *
 * @param {String} value
 *
 * @returns {boolean}
 *
 */
Address.isValid = AddressClass.isValid;

/**
 * Expose toChecksum by taking an address
 * as string and creating the object
 *
 * @param {String} address
 *
 * @returns {Address}
 *
 */
Address.toChecksum = (address) => {
    return Address(address).toChecksum();
};

/**
 * Create an Address object from an IBAN string
 *
 * @param {String} iban
 *
 * @returns {Address}
 *
 */
Address.fromIban = (iban) => {
    return Address(Iban.toAddress(iban));
};
