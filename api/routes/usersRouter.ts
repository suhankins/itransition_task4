import { Router } from 'express';
import {
    deleteUser,
    getUserBySessionId,
    getUsers,
    makeSessionId,
    newSessionId,
    newUser,
    saveSessionId,
    updateUserStatus,
} from '../db/usersDb';
import { validateNotBlocked } from '../validators/generalValidators';
import {
    User,
    UserSignupParams,
    validateLoggedIn,
    validateSignin,
    validateSignupParams,
} from '../validators/userValidator';

export let usersRouter = Router();

/**
 * Sign up action
 */
usersRouter.post('/signup', async (req, res) => {
    let user: UserSignupParams = req.body;
    let result = await validateSignupParams(user);

    // Successfully validated
    if (result === null) {
        res.cookie(
            'session_id',
            await newUser(user.username, user.password, user.email)
        );
        res.sendStatus(200);
    } else {
        res.status(400).send(JSON.stringify(result));
    }
});

/**
 * Sign in action
 */
usersRouter.post('/signin', async (req, res) => {
    let user: User = req.body;
    let result = await validateSignin(user);

    if (result == null) {
        res.cookie('session_id', await newSessionId(user.username));
        res.sendStatus(200);
    } else {
        res.status(400).send(JSON.stringify(result));
    }
});

/**
 * Logout action
 */
usersRouter.get('/logout', async (req, res) => {
    if (
        req.cookies.session_id &&
        (await validateLoggedIn(req.cookies.session_id))
    ) {
        saveSessionId(
            (await getUserBySessionId(req.cookies.session_id)) as string,
            makeSessionId(64)
        );
    }
    res.redirect('/');
});

/**
 * Delete action
 */
usersRouter.post('/delete', async (req, res) => {
    if (
        req.cookies.session_id &&
        (await validateLoggedIn(req.cookies.session_id))
    ) {
        const toBeDeleted: string[] = req.body;
        if (toBeDeleted.length === 0) {
            res.sendStatus(400);
        }
        toBeDeleted.forEach((id: string) => {
            deleteUser(id);
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

/**
 * (Un)Block action handler
 */
function getActionHandler(status: string | null) {
    return async (req: any, res: any) => {
        if (
            req.cookies.session_id &&
            (await validateLoggedIn(req.cookies.session_id))
        ) {
            const toBeEdited: string[] = req.body;
            if (toBeEdited.length === 0) {
                res.sendStatus(400);
            }
            toBeEdited.forEach(async (id: string) => {
                await updateUserStatus(id, status);
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    };
}

/**
 * Block action
 */
usersRouter.post('/block', getActionHandler('blocked'));

/**
 * Unblock action
 */
usersRouter.post('/unblock', getActionHandler(null));

/**
 * Get all users action
 */
usersRouter.get('/', async (req, res) => {
    if (
        req.cookies.session_id &&
        (await validateLoggedIn(req.cookies.session_id))
    ) {
        res.send(JSON.stringify(await getUsers()));
        return;
    }
    res.sendStatus(401);
});
