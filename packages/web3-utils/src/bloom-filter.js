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
 * @file bloom.js
 * @author Bas van Kervel <bas@ethereum.org>
 * @date 2017
 */

/**
 * Ethereum bloom filter support.
 *
 * TODO UNDOCUMENTED
 *
 * @module bloom
 * @class [bloom] bloom
 */

import { isBloom, isAddress, sha3, isTopic } from './utils.js';

function codePointToInt (codePoint) {
  if (codePoint >= 48 && codePoint <= 57) { /* ['0'..'9'] -> [0..9] */
    return codePoint - 48;
  }

  if (codePoint >= 65 && codePoint <= 70) { /* ['A'..'F'] -> [10..15] */
    return codePoint - 55;
  }

  if (codePoint >= 97 && codePoint <= 102) { /* ['a'..'f'] -> [10..15] */
    return codePoint - 87;
  }

  throw new Error('invalid bloom');
}

function testBytes (bloom, bytes) {
  /* eslint-disable no-bitwise */

  const hash = sha3(bytes).replace('0x', '');
  for (let i = 0; i < 12; i += 4) {
    // calculate bit position in bloom filter that must be active
    const bitpos = (
      (parseInt(hash.substr(i, 2), 16) << 8) + parseInt(hash.substr((i + 2), 2), 16)
    ) & 2047;

    // test if bitpos in bloom is active
    const code = codePointToInt(bloom.charCodeAt(bloom.length - 1 - Math.floor(bitpos / 4)));
    const offset = 1 << (bitpos % 4);

    if ((code & offset) !== offset) {
      return false;
    }
  }

  return true;
  /* eslint-enable no-bitwise */
}

/**
 * Returns true if address is part of the given bloom.
 * note: false positives are possible.
 *
 * @method testAddress
 * @param {String} hex encoded bloom
 * @param {String} address in hex notation
 * @returns {Boolean} topic is (probably) part of the block
 */
export function testAddress (bloom, address) {
  if (!isBloom(bloom)) {
    throw new Error('Invalid bloom given');
  }
  if (!isAddress(address)) {
    throw new Error(`Invalid address given: "${address}"`);
  }

  return testBytes(bloom, address);
}

/**
 * Returns true if the topic is part of the given bloom.
 * note: false positives are possible.
 *
 * @method hasTopic
 * @param {String} hex encoded bloom
 * @param {String} address in hex notation
 * @returns {Boolean} topic is (probably) part of the block
 */
export function testTopic (bloom, topic) {
  if (!isBloom(bloom)) throw new Error('invalid bloom');
  if (!isTopic(topic)) throw new Error('invalid topic');
  return testBytes(bloom, topic);
}
