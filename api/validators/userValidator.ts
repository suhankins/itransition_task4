import { client } from '../db/indexDb';
import { getUserBySessionId } from '../db/usersDb';
import {
    validateNotTooLong,
    validateNotEmpty,
    validateMatch,
    validateUnique,
    validatePassword,
    validateNoSpecialSymbols,
    validateNotBlocked,
} from './generalValidators';

export type User = {
    username: string;
    password: string;
};

export type UserSignupParams = {
    username: string;
    email: string | null;
    password: string;
    repeatPassword: string;
};

export type SignupErrors = UserSignupParams;
export type LoginErorrs = User;

/**
 * Checks if given user signup params are correct
 * @param user user signup params
 * @returns either errors or null if there are none
 */
export async function validateSignupParams(
    user: UserSignupParams
): Promise<UserSignupParams | null> {
    if (user.email === '') user.email = null;
    user.username = user.username.trim();

    let errors: SignupErrors = {
        username:
            validateNotEmpty('Username', user.username) ||
            validateNotTooLong('Username', user.username) ||
            validateNoSpecialSymbols('Username', user.username) ||
            (await validateUnique(
                'Username',
                'users',
                'username',
                user.username
            )) ||
            '',
        email:
            user.email === null || user.email === undefined
                ? ''
                : validateNotTooLong('Email', user.email) ||
                  (await validateUnique(
                      'Email',
                      'users',
                      'email',
                      user.email
                  )) ||
                  '',
        password:
            validateNotEmpty('Password', user.password) ||
            validateNotTooLong('Password', user.password) ||
            '',
        repeatPassword:
            validateMatch('Passwords', user.password, user.repeatPassword) ||
            '',
    };

    if (
        errors.username !== '' ||
        errors.email !== '' ||
        errors.password !== '' ||
        errors.repeatPassword !== ''
    ) {
        return errors;
    }
    return null;
}

export async function validateSignin(user: User): Promise<LoginErorrs | null> {
    user.username = user.username.trim();
    let errors: LoginErorrs = {
        username:
            validateNotEmpty('Username', user.username) ||
            (await validateNotBlocked(user.username)) ||
            (await validatePassword(user.username, user.password)) ||
            '',
        password: '',
    };

    if (errors.username !== '') {
        return errors;
    }
    return null;
}

export async function validateLoggedIn(secret: string): Promise<boolean> {
    let result = await getUserBySessionId(secret);
    if (result) {
        return true;
    }
    return false;
}