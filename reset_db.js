import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

const db = createClient({ url, authToken });

async function resetAndSeed() {
    console.log("Resetting DB...");

    try {
        // 1. Drop old tables
        await db.execute("DROP TABLE IF EXISTS posts");
        await db.execute("DROP TABLE IF EXISTS users");
        console.log("Dropped tables.");

        // 2. Create correct tables
        await db.execute(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);

        await db.execute(`
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
        title TEXT,
        content TEXT,
        author_id INTEGER,
        image TEXT, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);
        // Added 'image' column explicitly as we are using it in the frontend now

        console.log("Created tables with correct schema.");

        // 3. Seed User
        const password = bcrypt.hashSync("password", 10);
        const u = await db.execute({
            sql: "INSERT INTO users (username, password) VALUES (?, ?) RETURNING id",
            args: ["creative_soul", password]
        });
        // Turso/LibSQL returning support varies, assume it worked or fetch
        // Actually standard Turso/SQLite supports RETURNING.
        // Let's just fetch to be safe.
        const userRes = await db.execute("SELECT * FROM users WHERE username = 'creative_soul'");
        const userId = userRes.rows[0].id;
        console.log("Created user:", userId);

        // 4. Seed Posts
        const posts = [
            {
                title: "Chasing Sunsets in Kyoto",
                content: "Kyoto is a city of thousand contrasts...",
                image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
                slug: "chasing-sunsets-kyoto"
            },
            {
                title: "The Art of Abstract Pastels",
                content: "Pastel colors aren't just for nurseries...",
                image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80",
                slug: "art-abstract-pastels"
            },
            {
                title: "Digital Nomad Life: Bali",
                content: "Working from a cafe with a view...",
                image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
                slug: "digital-nomad-bali"
            },
            {
                title: "Modern Pottery Workshop",
                content: "Getting my hands dirty at the local ceramic studio...",
                image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
                slug: "pottery-workshop"
            },
            {
                title: "Exploring Film Photography",
                content: "I bought a vintage Canon AE-1...",
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
                slug: "film-photography"
            },
            {
                title: "Sunday Morning Rituals",
                content: "Slow mornings are essential for creativity...",
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
                slug: "sunday-morning"
            }
        ];

        for (const post of posts) {
            // Append some markdown to content for the view
            const fullContent = `![Cover](${post.image})\n\n${post.content}`;

            await db.execute({
                sql: "INSERT INTO posts (title, slug, content, author_id, image) VALUES (?, ?, ?, ?, ?)",
                args: [post.title, post.slug + "-" + Date.now(), fullContent, userId, post.image]
            });
            console.log(`Added: ${post.title}`);
        }

        console.log("Database reset and seeded successfully!");

    } catch (err) {
        console.error("Error:", err);
    }
}

resetAndSeed();
