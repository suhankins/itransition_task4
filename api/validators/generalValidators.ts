import { client } from '../db/indexDb';
import { isUserBlocked } from '../db/usersDb';

/**
 * Validates, that given string is not too long
 * @param name
 * @param value
 * @param maxLength defaults to 255
 * @returns `${name} can't be longer than ${maxLength} symbols` or null, if valid
 */
export function validateNotTooLong(
    name: string,
    value: string,
    maxLength: number = 255
): string | null {
    if (value.length > maxLength) {
        return `${name} can't be longer than ${maxLength} symbols`;
    }
    return null;
}

/**
 * Validates, that given string isn't empty
 * @param name
 * @param value
 * @returns `${name} can't be empty` or null, if valid
 */
export function validateNotEmpty(name: string, value: string): string | null {
    if (value === undefined || value.length === 0) {
        return `${name} can't be empty`;
    }
    return null;
}

/**
 * Validates, that two given strings match
 * @param name
 * @param value1
 * @param value2
 * @returns `${name} must match` or null, if valid
 */
export function validateMatch(
    name: string,
    value1: any,
    value2: any
): string | null {
    if (value1 !== value2) {
        return `${name} must match`;
    }
    return null;
}

/**
 * Validates, that given value is unique in given column
 * @param name
 * @param column
 * @param value
 * @returns `${name} already taken` or null, if it is unique
 */
export async function validateUnique(
    name: string,
    table: string,
    column: string,
    value: string
): Promise<string | null> {
    if (value === '') return null;
    let result: string | null = `${name} already taken`;
    await client
        .query(`SELECT * FROM ${table} WHERE ${column}=$1;`, [value])
        .then((queryResult) => {
            if (queryResult.rowCount === 0) result = null;
        });
    return result;
}

/**
 * Validates, that password and username belong to the same entry.
 * @param username
 * @param password
 * @returns `User with given nickname does not exist or password is incorrect` or null
 */
export async function validatePassword(
    username: string,
    password: string
): Promise<string | null> {
    let result:
        | string
        | null = `User with given nickname does not exist or password is incorrect`;
    await client
        .query(`SELECT * FROM users WHERE username=$1 AND password=$2;`, [
            username,
            password,
        ])
        .then((queryResult) => {
            if (queryResult.rowCount === 1) result = null;
        });
    return result;
}

/**
 * Validates that user is not blocked
 * @param username
 * @returns `You are blocked and can no longer sign in` or null
 */
export async function validateNotBlocked(
    username: string
): Promise<string | null> {
    if (await isUserBlocked(username)) {
        return `You are blocked and can no longer sign in`;
    }
    return null;
}

/**
 * Validates, that given string only contains latin letters and digits
 * @param name
 * @param value
 * @returns `${name} cannot contain special symbols` or null
 */
export function validateNoSpecialSymbols(
    name: string,
    value: string
): string | null {
    if (!value.match(/^[a-zA-Z\d]*$/)) {
        return `${name} cannot contain special symbols`;
    }
    return null;
}
