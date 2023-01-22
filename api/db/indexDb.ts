import { Client } from 'pg';

export let client: Client;
export function connectClient() {
    client = new Client();
    client.connect();
}
