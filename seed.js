import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) { console.error("No URL found"); process.exit(1); }

const db = createClient({ url, authToken });

const seed = async () => {
    console.log("Adding cool pastel content...");

    try {
        // 1. Create a Seed User
        const password = bcrypt.hashSync("password", 10);
        let userId;

        // Check if user exists
        const userCheck = await db.execute("SELECT * FROM users WHERE username = 'creative_soul'");
        if (userCheck.rows.length === 0) {
            const u = await db.execute({
                sql: "INSERT INTO users (username, password) VALUES (?, ?) RETURNING id",
                args: ["creative_soul", password]
            });
            // Handle different return structures if needed, but Turso usually returns lastInsertRowid in result or we can query
            const userRes = await db.execute("SELECT * FROM users WHERE username = 'creative_soul'");
            userId = userRes.rows[0].id;
        } else {
            userId = userCheck.rows[0].id;
        }

        // 2. Add Posts
        const posts = [
            {
                title: "Chasing Sunsets in Kyoto",
                content: "Kyoto is a city of thousand contrasts. From the serene bamboo forests of Arashiyama to the bustling streets of Gion... \n\n![Kyoto](https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80)\n\nIt truly felt like walking through a living painting. The colors of the temples against the autumn leaves were simply **magical**.",
                image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
                slug: "chasing-sunsets-kyoto"
            },
            {
                title: "The Art of Abstract Pastels",
                content: "Pastel colors aren't just for nurseries. They represent a softness in a harsh world. I've been experimenting with oil pastels lately...\n\n![Art](https://images.unsplash.com/photo-1515405295579-ba7a45250f13?w=800&auto=format&fit=crop&q=80)",
                image: "https://images.unsplash.com/photo-1515405295579-ba7a45250f13?w=800&auto=format&fit=crop&q=80",
                slug: "art-abstract-pastels"
            },
            {
                title: "Digital Nomad Life: Bali",
                content: "Working from a cafe with a view of rice terraces. Is this real life? \n\nCheck out my setup:\n\n* Laptop stand\n* Good coffee\n* Great wifi\n\n![Bali](https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80)",
                image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
                slug: "digital-nomad-bali"
            },
            {
                title: "Modern Pottery Workshop",
                content: "Getting my hands dirty at the local ceramic studio. There's something so grounding about clay. I made a mug! It's a bit crooked but I love it.",
                image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
                slug: "pottery-workshop"
            },
            {
                title: "Exploring Film Photography",
                content: "I bought a vintage Canon AE-1. The waiting game for development is the best part. Here are some shots from my first roll.",
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
                slug: "film-photography"
            },
            {
                title: "Sunday Morning Rituals",
                content: "Slow mornings are essential for creativity. Pancakes, jazz vinyls, and a long walk in the park.",
                image: "https://images.unsplash.com/photo-1504911539060-755a305364ca?w=800&auto=format&fit=crop&q=80",
                slug: "sunday-morning"
            }
        ];

        for (const post of posts) {
            try {
                await db.execute({
                    sql: "INSERT INTO posts (title, content, slug, author_id) VALUES (?, ?, ?, ?)",
                    args: [post.title, post.content, post.slug + "-" + Date.now(), userId]
                });
                console.log(`Added: ${post.title}`);
            } catch (e) {
                console.error(`FAILED to add ${post.title}:`, e);
            }
        }

        console.log("Seeding complete!");
    } catch (err) {
        console.error("Error seeding:", err);
    }
};

seed();
