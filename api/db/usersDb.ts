import { client } from './indexDb';

/**
 * Get the full list of users
 * @returns list full of users
 */
export async function getUsers() {
    const result = await client.query(
        'SELECT (id, username, email, date_reg, date_logged_in, status) FROM users;'
    );
    return result.rows.map((entry) => {
        let row = entry.row;
        row = row.slice(1, -1); // Removing ( and )
        row = row.split(',');
        return {
            id: row[0],
            username: row[1],
            email: row[2] === '' ? null : row[1],
            date_reg: row[3],
            date_logged_in: row[4],
            status: row[5],
        };
    });
}

export async function newUser(
    username: string,
    password: string,
    email: string | null
) {
    await client.query(
        'INSERT INTO users(username, email, password, date_reg) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, password, Date.now()]
    );
    return newSessionId(username);
}

export async function deleteUser(id: string) {
    await client.query(
        'DELETE FROM users WHERE id=$1;',
        [id]
    );
}

export async function updateUserStatus(id: string, status: string | null) {
    await client.query(
        'UPDATE users SET status=$1 WHERE id=$2;',
        [status, id]
    );
    if (status === 'blocked') {
        await client.query(
            'UPDATE users SET session_id=$1 WHERE id=$2;',
            [makeSessionId(64), id]
        );
    }
}

export async function isUserBlocked(username: string) {
    const result = await client.query(
        "SELECT * FROM users WHERE username=$1 AND status='blocked';",
        [username]
    );
    return result.rowCount === 1;
}

export function makeSessionId(length: number) {
    var result = '';
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export async function newSessionId(username: string) {
    const sessionId = makeSessionId(64);
    saveSessionId(username, sessionId);
    return sessionId;
}

export async function getUserBySessionId(
    secret: string
): Promise<string | undefined> {
    const result = await client.query(
        'SELECT (username) FROM users WHERE session_id=$1;',
        [secret]
    );
    return result.rows[0]?.username;
}

export async function saveSessionId(username: string, sessionId: string) {
    const result = await client.query(
        'UPDATE users SET session_id=$1, date_logged_in=$2 WHERE username=$3;',
        [sessionId, Date.now(), username]
    );
    return result;
}
