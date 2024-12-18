<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email</label>
        <input v-model="email" id="email" type="email" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);
const router = useRouter();
const { $supabase } = useNuxtApp();

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  const { data, error: loginError } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (loginError) {
    error.value = loginError.message;
    console.error("Login failed:", loginError.message);
  } else {
    console.log("Login successful:", data);
    router.push("/dashboard");
  }

  loading.value = false;
};

definePageMeta({
  layout: "auth", // Use the 'auth' layout for this page
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}
.error {
  color: red;
}
</style>
