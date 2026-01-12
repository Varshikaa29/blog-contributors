<template>
  <div class="auth-container">
    <div class="glass-card auth-card">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" class="btn">Login</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../db';
import bcrypt from 'bcryptjs';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const login = async () => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: [username.value],
    });

    const user = result.rows[0];

    if (user && bcrypt.compareSync(password.value, user.password)) {
      // For frontend-only, we'll just store the user object/ID in localStorage
      // In a real app, you'd want a secure session/token, but we are removing the backend.
      localStorage.setItem('user', JSON.stringify({ id: user.id, username: user.username }));
      localStorage.setItem('token', 'dummy-token'); // Keep compatibility with checks
      window.location.href = '/'; 
    } else {
      error.value = "Invalid credentials";
    }
  } catch (err) {
    console.error(err);
    error.value = 'An error occurred';
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
.auth-card {
  width: 100%;
  max-width: 400px;
}
.error {
  color: #ff4d4d;
  margin-top: 1rem;
}
</style>
