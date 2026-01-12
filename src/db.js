import { createClient } from "@libsql/client";

const url = import.meta.env.VITE_TURSO_DATABASE_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error("Missing Turso credentials. Please check your .env file.");
}

export const db = createClient({
    url,
    authToken,
});
