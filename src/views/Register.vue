<template>
  <div class="auth-container">
    <div class="glass-card auth-card">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" class="btn">Register</button>
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

const register = async () => {
  try {
    const hashedPassword = bcrypt.hashSync(password.value, 10);

    await db.execute({
      sql: "INSERT INTO users (username, password) VALUES (?, ?)",
      args: [username.value, hashedPassword],
    });

    router.push('/login');
  } catch (err) {
    console.error(err);
    if (err.message && err.message.includes("UNIQUE constraint failed")) {
       error.value = "Username already exists";
    } else {
       error.value = 'An error occurred during registration';
    }
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
