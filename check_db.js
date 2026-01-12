import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

console.log("URL:", url);
// Don't log full token for security, just presence
console.log("Token Present:", !!authToken);

const db = createClient({ url, authToken });

async function check() {
    try {
        const users = await db.execute("SELECT * FROM users");
        console.log("Users count:", users.rows.length);
        console.log("Users:", users.rows);

        const posts = await db.execute("SELECT * FROM posts");
        console.log("Posts count:", posts.rows.length);

        // Check Schema
        const schema = await db.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='posts'");
        console.log("Schema:", schema.rows[0]);
        if (posts.rows.length > 0) {
            console.log("First Post:", posts.rows[0]);
        } else {
            console.log("NO POSTS FOUND.");
        }

    } catch (err) {
        console.error("DB Error:", err);
    }
}

check();
