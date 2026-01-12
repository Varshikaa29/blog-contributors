<template>
  <div>
    <nav class="nav">
      <router-link to="/" class="nav-brand">Sunlit Stories.</router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="nav-link">Login</router-link>
        <router-link v-if="!isAuthenticated" to="/register" class="nav-link">Register</router-link>
        <router-link v-if="isAuthenticated" to="/create" class="nav-link">Write</router-link>
        <a v-if="isAuthenticated" @click="logout" class="nav-link" href="#">Logout</a>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const token = ref(localStorage.getItem('token'));

const isAuthenticated = computed(() => !!token.value);

const logout = () => {
  localStorage.removeItem('token');
  token.value = null;
  router.push('/login');
  // Force reload/re-evaluate check if needed, but reactivity should work if we track global state.
  // For simplicity, we might reload or use a store. 
  // Simple hack for this task:
  window.location.reload(); 
};
</script>
