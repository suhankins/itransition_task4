import * as dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { createServer } from 'http';
import { connectClient } from './db/indexDb';

connectClient();

/**
 * Store port in Express.
 */

app.set('port', process.env.PORT || 9000);

/**
 * Create HTTP server.
 */

let server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
});
