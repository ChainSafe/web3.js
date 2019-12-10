// This file was internalized from silentcicero/ethjs-unit
// in order to reduce the bundle size. Package shared a
// bn.js dependency which wasn't being updated resulting
// in duplicate versions of that dep included in webpacks

/*
The MIT License (MIT)

Copyright (c) 2016 Nick Dodson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

/*
Primary Attribution
Richard Moore <ricmoo@me.com>
https://github.com/ethers-io
Note, Richard is a god of ether gods. Follow and respect him, and use Ethers.io!
*/

const BN = require('bn.js');
const numberToBN = require('./numberToBN');

const zero = new BN(0);
const negative1 = new BN(-1);

// complete ethereum unit map
const unitMap = {
  'noether':      '0', // eslint-disable-line
  'wei':          '1', // eslint-disable-line
  'kwei':         '1000', // eslint-disable-line
  'Kwei':         '1000', // eslint-disable-line
  'babbage':      '1000', // eslint-disable-line
  'femtoether':   '1000', // eslint-disable-line
  'mwei':         '1000000', // eslint-disable-line
  'Mwei':         '1000000', // eslint-disable-line
  'lovelace':     '1000000', // eslint-disable-line
  'picoether':    '1000000', // eslint-disable-line
  'gwei':         '1000000000', // eslint-disable-line
  'Gwei':         '1000000000', // eslint-disable-line
  'shannon':      '1000000000', // eslint-disable-line
  'nanoether':    '1000000000', // eslint-disable-line
  'nano':         '1000000000', // eslint-disable-line
  'szabo':        '1000000000000', // eslint-disable-line
  'microether':   '1000000000000', // eslint-disable-line
  'micro':        '1000000000000', // eslint-disable-line
  'finney':       '1000000000000000', // eslint-disable-line
  'milliether':   '1000000000000000', // eslint-disable-line
  'milli':        '1000000000000000', // eslint-disable-line
  'ether':        '1000000000000000000', // eslint-disable-line
  'kether':       '1000000000000000000000', // eslint-disable-line
  'grand':        '1000000000000000000000', // eslint-disable-line
  'mether':       '1000000000000000000000000', // eslint-disable-line
  'gether':       '1000000000000000000000000000', // eslint-disable-line
  'tether':       '1000000000000000000000000000000', // eslint-disable-line
};

/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default ether
 * @returns {BigNumber} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
function getValueOfUnit(unitInput) {
  const unit = unitInput ? unitInput.toLowerCase() : 'ether';
  var unitValue = unitMap[unit]; // eslint-disable-line

  if (typeof unitValue !== 'string') {
    throw new Error(`[ethjs-unit] the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(unitMap, null, 2)}`);
  }

  return new BN(unitValue, 10);
}

function numberToString(arg) {
  if (typeof arg === 'string') {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(`while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`);
    }
    return arg;
  } else if (typeof arg === 'number') {
    return String(arg);
  } else if (typeof arg === 'object' && arg.toString && (arg.toTwos || arg.dividedToIntegerBy)) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    } else { // eslint-disable-line
      return arg.toString(10);
    }
  }
  throw new Error(`while converting number to string, invalid number value '${arg}' type ${typeof arg}.`);
}

function fromWei(weiInput, unit, optionsInput) {
  var wei = numberToBN(weiInput); // eslint-disable-line
  var negative = wei.lt(zero); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;
  const options = optionsInput || {};

  if (negative) {
    wei = wei.mul(negative1);
  }

  var fraction = wei.mod(base).toString(10); // eslint-disable-line

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`;
  }

  if (!options.pad) {
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  }

  var whole = wei.div(base).toString(10); // eslint-disable-line

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var value = `${whole}${fraction == '0' ? '' : `.${fraction}`}`; // eslint-disable-line

  if (negative) {
    value = `-${value}`;
  }

  return value;
}

function toWei(etherInput, unit) {
  var ether = numberToString(etherInput); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;

  // Is it negative?
  var negative = (ether.substring(0, 1) === '-'); // eslint-disable-line
  if (negative) {
    ether = ether.substring(1);
  }

  if (ether === '.') { throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei, invalid value`); }

  // Split it into a whole and fractional part
  var comps = ether.split('.'); // eslint-disable-line
  if (comps.length > 2) { throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei,  too many decimal points`); }

  var whole = comps[0], fraction = comps[1]; // eslint-disable-line

  if (!whole) { whole = '0'; }
  if (!fraction) { fraction = '0'; }
  if (fraction.length > baseLength) { throw new Error(`[ethjs-unit] while converting number ${etherInput} to wei, too many decimal places`); }

  while (fraction.length < baseLength) {
    fraction += '0';
  }

  whole = new BN(whole);
  fraction = new BN(fraction);
  var wei = (whole.mul(base)).add(fraction); // eslint-disable-line

  if (negative) {
    wei = wei.mul(negative1);
  }

  return new BN(wei.toString(10), 10);
}

module.exports = {
  unitMap,
  numberToString,
  getValueOfUnit,
  fromWei,
  toWei,
};