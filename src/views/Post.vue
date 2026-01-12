<template>
  <div v-if="post" class="post-container">
    <article class="glass-card">
      <header>
        <h1>{{ post.title }}</h1>
        <div class="meta">
          <span>{{ new Date(post.created_at).toLocaleDateString() }}</span>
        </div>
      </header>
      <div class="content" v-html="renderedContent"></div>
    </article>
  </div>
  <div v-else class="loading">Loading...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import { db } from '../db';

const route = useRoute();
const post = ref(null);

const renderedContent = computed(() => {
  return post.value ? marked(post.value.content) : '';
});

onMounted(async () => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM posts WHERE slug = ?",
      args: [route.params.slug],
    });

    if (result.rows.length > 0) {
      post.value = result.rows[0];
    }
  } catch (err) {
    console.error(err);
  }
});
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
}
header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border);
}
.meta {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.content {
  line-height: 1.8;
  color: #e2e8f0;
}
/* Markdown Styles */
:deep(.content h1), :deep(.content h2) {
  margin-top: 2rem;
  color: white;
}
:deep(.content a) {
  color: var(--primary-color);
}
:deep(.content code) {
  background: rgba(0,0,0,0.3);
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
  font-family: monospace;
}
:deep(.content pre) {
  background: rgba(0,0,0,0.3);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
</style>
