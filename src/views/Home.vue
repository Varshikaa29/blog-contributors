<template>
  <div>
    <!-- Hero Section -->
    <header class="hero">
      <h5>Welcome to</h5>
      <h1>Sunlit Stories.</h1>
      <p>A collection of thoughts, memories, and bright ideas.</p>
    </header>

    <!-- Collection Header -->
    <div class="collection-header">
      <h2>The Collection</h2>
      <div class="divider"></div>
    </div>

    <!-- Blog Grid -->
    <div class="grid-layout">
      <div v-for="post in posts" :key="post.id" class="editorial-card" @click="$router.push('/post/' + post.slug)">
          
          <div class="image-wrapper"> 
             <img :src="post.image || `https://images.unsplash.com/photo-${1500000000000 + post.id}?w=800&auto=format&fit=crop&q=80`" alt="Cover" loading="lazy" />
          </div>
          
          <div class="card-body">
            <span class="meta">{{ new Date(post.created_at).toLocaleDateString() }}</span>
            <h3>{{ post.title }}</h3>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../db';
import { useRouter } from 'vue-router';

const posts = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const result = await db.execute("SELECT * FROM posts ORDER BY created_at DESC");
    posts.value = result.rows;
  } catch (err) {
    console.error(err);
  }
});
</script>

<style scoped>
.hero {
  text-align: center;
  margin: 4rem 0 5rem 0;
}
.hero h1 { 
  margin-top: 0.2rem; 
  font-size: 5rem; 
  color: var(--brand-color);
  line-height: 1.1;
  /* Text Shadow for pop */
  text-shadow: 2px 2px 0px rgba(255,255,255,0.5);
}
.hero h5 { 
  font-family: var(--font-sans); 
  color: var(--text-headers);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.5rem; 
  margin-bottom: 0;
}
.hero p {
  font-size: 1.4rem;
  color: var(--text-main);
  max-width: 600px;
  margin: 1rem auto 0 auto;
  font-weight: 300;
}

.collection-header {
  margin-bottom: 3rem;
  text-align: center;
}
.collection-header h2 {
  font-size: 2.5rem;
  color: var(--text-headers);
  margin-bottom: 1rem;
}
.divider {
  width: 60px;
  height: 4px;
  background: var(--brand-color);
  margin: 0 auto;
  border-radius: 2px;
}

.image-wrapper {
  overflow: hidden;
  height: 300px;
}
</style>
