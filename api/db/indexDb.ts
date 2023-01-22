import { Client } from 'pg';

export let client: Client;
export function connectClient() {
    client = new Client({
        connectionString: process.env.CONNECTION_STRING
    });
    client.connect();
}
