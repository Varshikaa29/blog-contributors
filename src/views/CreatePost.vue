<template>
  <div style="max-width: 700px; margin: 0 auto;">
    <h2>Write a Story</h2>
    <form @submit.prevent="createPost">
      <div>
        <input v-model="title" type="text" placeholder="Title" required style="font-size: 2rem; font-weight: 700; border: none; border-bottom: 1px solid #ddd; padding-left: 0;" />
      </div>
      
      <div>
        <input v-model="image" type="text" placeholder="Cover Image URL (optional)" />
      </div>

      <div>
        <textarea v-model="content" rows="15" placeholder="Tell your story..." required style="border: none; padding-left: 0; font-size: 1.1rem; resize: none;"></textarea>
      </div>
      
      <button type="submit" class="btn">Publish</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../db';

const title = ref('');
const content = ref('');
const image = ref('');
const router = useRouter();

const createPost = async () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return router.push('/login');
  
  const user = JSON.parse(userStr);

  try {
    const slug = title.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") + "-" + Date.now();

    // Note: We need to alter table or add 'image' column to support this fully in DB. 
    // For now, since schema is fixed, we might append it to content or ignore.
    // Let's assume we update the schema or just use a default random one in display.
    // Plan update: We didn't migrate DB schema. Let's stick to inserting title/content
    // and let the frontend generate random images for existing posts, 
    // BUT we should try to store it if possible. 
    // Since we can't easily ALTER TABLE without a migration tool/script here easily in one go, 
    // I will append the image URL to the content as metadata in front. 
    
    // Simple Metadata Hack: 
    // ---
    // image: url
    // ---
    
    const finalContent = image.value ? `![Cover](${image.value})\n\n${content.value}` : content.value;

    await db.execute({
      sql: "INSERT INTO posts (title, content, slug, author_id) VALUES (?, ?, ?, ?)",
      args: [title.value, finalContent, slug, user.id],
    });

    router.push('/');
  } catch (err) {
    console.error(err);
    alert('Failed to create post');
  }
};
</script>
