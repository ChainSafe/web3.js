import { setLengthLeft, toBuffer } from 'ethereumjs-util';

import { ValidTypes, ValidTypesEnum, PrefixedHexString } from '../types';

function determineValidType(input: ValidTypes): ValidTypesEnum {
    try {
        switch (typeof input) {
            case 'number':
                if (input < 0)
                    throw Error(`Cannot convert number less than 0: ${input}`);
                if ((input as number) % 1 !== 0)
                    throw Error(`Cannot convert float: ${input}`);
                return ValidTypesEnum.Number;
            case 'string':
                if (/^[0-9]+$/i.test(input)) {
                    return ValidTypesEnum.NumberString;
                } else if (/^0x[0-9A-Fa-f]+$/i.test(input)) {
                    return ValidTypesEnum.PrefixedHexString;
                } else {
                    if (input.substr(0, 1) === '-')
                        throw Error(
                            `Cannot convert number less than 0: ${input}`
                        );
                    if (input.includes('.'))
                        throw Error(`Cannot convert float: ${input}`);
                    throw Error(`Cannot convert arbitrary string: ${input}`);
                }
            case 'bigint':
                if (input.toString(16).substr(0, 1) === '-')
                    throw Error(`Cannot convert number less than 0: ${input}`);
                return ValidTypesEnum.BigInt;
            default:
                throw Error(
                    `Provided input: ${input} is not a valid type (${Object.keys(
                        ValidTypesEnum
                    ).map((validType) => `${validType} `)})`
                );
        }
    } catch (error) {
        throw Error(
            `Error determining valid type for ${input}: ${error.message}`
        );
    }
}

function padHex(
    hexString: PrefixedHexString,
    byteLength: number
): PrefixedHexString {
    try {
        const bufferInput = toBuffer(hexString);
        const paddedBufferInput = setLengthLeft(bufferInput, byteLength);
        return `0x${paddedBufferInput.toString('hex')}`;
    } catch (error) {
        throw Error(
            `Error padding ${hexString} to ${byteLength} bytes: ${error.message}`
        );
    }
}

export function toHex(
    input: ValidTypes,
    byteLength?: number
): PrefixedHexString {
    try {
        if (input === null) throw Error('Cannot convert null input');

        let hexInput: PrefixedHexString;
        let parsedHexString: PrefixedHexString;
        switch (determineValidType(input)) {
            case ValidTypesEnum.Number:
                hexInput = `0x${input.toString(16)}`;
                break;
            case ValidTypesEnum.NumberString:
                parsedHexString = BigInt(input as string).toString(16);
                hexInput = `0x${parsedHexString}`;
                break;
            case ValidTypesEnum.PrefixedHexString:
                hexInput = input as string;
                break;
            case ValidTypesEnum.BigInt:
                parsedHexString = input.toString(16);
                hexInput = `0x${parsedHexString}`;
                break;
            default:
                throw Error(
                    `Provided input: ${input} is not a valid type (${Object.keys(
                        ValidTypesEnum
                    ).map((validType) => `${validType} `)})`
                );
        }
        return byteLength && hexInput.length < byteLength
            ? padHex(hexInput, byteLength)
            : hexInput;
    } catch (error) {
        throw Error(
            `Error converting ${input} to hex string: ${error.message}`
        );
    }
}

export function formatOutput(
    output: ValidTypes,
    desiredType: ValidTypesEnum
): ValidTypes {
    try {
        if (output === null || determineValidType(output) === desiredType)
            return output;

        // Doing this allows us to assume we're always converting
        // from PrefixedHexString to desiredType
        let formattedOutput: ValidTypes = toHex(output);

        switch (desiredType) {
            case ValidTypesEnum.Number:
                formattedOutput = parseInt(formattedOutput, 16);
                break;
            case ValidTypesEnum.PrefixedHexString:
                // formattedOutput has already been converted to PrefixedHexString
                break;
            case ValidTypesEnum.NumberString:
                formattedOutput = BigInt(formattedOutput).toString();
                break;
            case ValidTypesEnum.BigInt:
                formattedOutput = BigInt(formattedOutput);
                break;
            default:
                throw Error(
                    `Error formatting output, provided desiredType: ${desiredType} is not supported`
                );
        }
        return formattedOutput;
    } catch (error) {
        throw Error(
            `Error formatting output ${output} to ${desiredType}: ${error.message}`
        );
    }
}

export function formatRpcResultArray(
    rpcResponseResult: any,
    formattableProperties: string[],
    desiredType: ValidTypesEnum
): any {
    try {
        let formattedResponseResult = rpcResponseResult;
        for (const formattableProperty of formattableProperties) {
            if (Array.isArray(rpcResponseResult)) {
                // rpcResponseResult is an array of results
                // e.g. an array of filter changes or logs
                for (const result of rpcResponseResult) {
                    // @ts-ignore We're indexing result as an object, not an array
                    result[formattableProperty] = formatOutput(
                        // @ts-ignore We're indexing result as an object, not an array
                        result[formattableProperty],
                        desiredType
                    );
                }
            } else {
                // @ts-ignore We're indexing result as an object, not an array
                formattedResponseResult[formattableProperty] = formatOutput(
                    // @ts-ignore We're indexing result as an object, not an array
                    rpcResponseResult[formattableProperty],
                    desiredType
                );
            }
        }
        return formattedResponseResult;
    } catch (error) {
        throw Error(
            `Error formatting rpc result array to ${desiredType}: ${error.message}`
        );
    }
}
