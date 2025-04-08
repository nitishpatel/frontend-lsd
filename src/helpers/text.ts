import { Address } from '../types';
import { fromWei, toChecksumAddress } from 'web3-utils';

export const ethToXdcAddress = (address: string) => address?.replace(/^0x/, 'xdc');
export const xdcToEthAddress = (address: string) => address?.replace(/^xdc/, '0x');

export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['application/pdf'];

export const ellipsisShrinkStr = (str: string, start: number, end: number) => {
  return `${str?.slice(0, start)}...${str?.slice(-end)}`;
};
export const checksumAddress = (address: Address) => {
  return toChecksumAddress(address);
};
export const formatAddressShort = (address: Address) => {
  const xdcAddress =
    address.length > 42 ? ethToXdcAddress(address) : ethToXdcAddress(toChecksumAddress(address));
  // return xdcAddress;
  return ellipsisShrinkStr(xdcAddress, 7, 4);
};

export const formatFloat = (n: number, precision: number = 3) => {
  const i = Math.trunc(n); // Extract integer part
  const f = Math.abs(n - i); // Use absolute value for fractional part

  const fStr = f.toFixed(precision).replace(/0+$/, '').replace(/^0./, '');

  if (fStr.length === 0) {
    return i.toString(10);
  }

  return `${i.toString(10)}.${fStr}`;
};

export const convertFromWei = (value: string) => {
  return fromWei(value, 'ether') === '0.' ? value : fromWei(value, 'ether');
};

/**
 * Converts a number to a BigInt with scaling based on precision.
 * @param number - The input number to convert.
 * @param precision - The number of decimal places to scale by (default is 2).
 * @returns The scaled BigInt representation of the number.
 * @throws Error if the input is not a valid number.
 */
export function percentToBigInt(number: number, precision: number = 2): bigint {
  if (typeof number !== 'number' || isNaN(number)) {
    throw new Error('Input must be a valid number.');
  }
  const scaledNumber = Math.round(number * Math.pow(10, precision));
  return BigInt(scaledNumber);
}

/**
 * Converts a BigInt back to a number with the original scale.
 * @param bigIntValue - The BigInt to convert back.
 * @param precision - The number of decimal places to scale down by (default is 2).
 * @returns The original number representation.
 * @throws Error if the input is not a valid BigInt.
 */
export function bigIntToPercent(bigIntValue: bigint, precision: number = 2): number {
  if (typeof bigIntValue !== 'bigint') {
    throw new Error('Input must be a BigInt.');
  }
  return Number(bigIntValue) / Math.pow(10, precision);
}

/**
 * Takes an array of objects and a key string, and returns a dictionary where the values of the key
 * are the keys of the dictionary, and the values are the objects from the original array.
 * @param array - The array of objects to convert.
 * @param key - The key string to use as the dictionary key.
 * @returns A dictionary with the specified key as the key and the objects as the values.
 */
export const arrayToDict = (array: any[], key: string) => {
  return array.reduce((acc: any, item: any) => {
    acc[item[key]] = item;
    return acc;
  }, {});
};

/**
 * Takes an array of objects and a key string, and returns a dictionary where the values of the key
 * within the `token` object are the keys of the dictionary, and the values are the objects from the
 * original array.
 * @param array - The array of objects to convert.
 * @param key - The key string to use as the dictionary key within the `token` object.
 * @returns A dictionary with the specified key as the key and the objects as the values.
 */
export const arrayToDictForToken = (array: any[], key: string) => {
  return array.reduce((acc: any, item: any) => {
    const keyValue = item.token[key]; // Access the key within the token object
    acc[keyValue] = item;
    return acc;
  }, {});
};

/**
 * Converts a Date object to a Unix timestamp in seconds.
 * @param date - The date object to convert.
 * @returns The Unix timestamp in seconds.
 */
export const toEpoch = (date: any) => {
  // create a new javascript Date object using timezone as UTC
  const d = new Date(date);
  const utcDate = new Date(d.toUTCString());
  const epoch = utcDate.getTime() / 1000;
  return epoch;
};
