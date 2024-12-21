<template>
  <div class="font-mono">
    <div
      class="bg-gray-100 dark:bg-gray-900 p-20 flex flex-col items-center justify-center"
    >
      <div class="text-center mb-4">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">
          Hi There!
        </h1>
        <h3 class="text-gray-800 dark:text-white">Login to your account</h3>
      </div>
      <div
        class="max-w-lg w-full mx-auto sm:p-10 lg:p-12 rounded-lg shadow bg-white"
      >
        <form
          @submit.prevent="handleLogin"
          class="flex flex-col space-y-6 p-10"
          novalidate
        >
          <!-- Email -->
          <div class="flex flex-col space-y-2">
            <label class="block" for="email">Email</label>
            <input
              class="border border-gray-500 focus:ring-violet-500 rounded-md p-2 w-full placeholder:text-gray-500"
              v-model="email"
              id="email"
              type="email"
              placeholder="enter your email"
              required
              aria-describedby="email-error"
            />
            <p
              v-if="error && errorField === 'email'"
              id="email-error"
              class="text-xs text-red-500 mt-1"
            >
              {{ error }}
            </p>
          </div>

          <!-- Password -->
          <div class="flex flex-col space-y-2">
            <label class="block" for="password">Password</label>
            <div class="relative">
              <input
                class="border border-gray-500 focus:ring-violet-500 rounded-md p-2 pr-10 w-full placeholder:text-gray-500"
                v-model="password"
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="enter your password"
                required
                aria-describedby="password-error"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <template v-if="showPassword">
                  <!-- Eye-off Icon -->
                  <EyeIcon class="h-5 w-5" />
                </template>
                <template v-else>
                  <!-- Eye Icon -->
                  <EyeSlashIcon class="h-5 w-5" />
                </template>
              </button>
            </div>
            <p
              v-if="error && errorField === 'password'"
              id="password-error"
              class="text-xs text-red-500 mt-1"
            >
              {{ error }}
            </p>
          </div>

          <!-- Forgot password -->
          <div class="flex items-center justify-end">
            <a
              href="/auth/forgot-password"
              class="text-xs text-violet-500 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <!-- Submit button -->
          <div class="flex items-center justify-center space-x-2">
            <button
              :class="[
                'flex w-full items-center justify-center py-2 px-4 text-sm font-medium rounded-lg shadow-sm text-white bg-violet-500 hover:bg-violet-600 dark:bg-teal-500 dark:hover:bg-teal-600',
                loading ? '!bg-gray-400 cursor-not-allowed' : '',
              ]"
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" class="loader mr-2"></span>
              {{ loading ? "Logging in..." : "Login" }}
            </button>
          </div>
        </form>
      </div>
      <BrandFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import BrandFooter from "~/components/BrandFooter.vue";

import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";

import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref(null);
const errorField = ref(null);
const router = useRouter();
const { $supabase } = useNuxtApp();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const validateForm = () => {
  if (!email.value) {
    error.value = "Email is required.";
    errorField.value = "email";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    error.value = "Please enter a valid email address.";
    errorField.value = "email";
    return false;
  }

  if (!password.value) {
    error.value = "Password is required.";
    errorField.value = "password";
    return false;
  }

  return true;
};

const handleLogin = async () => {
  error.value = null;
  errorField.value = null;

  if (!validateForm()) return;

  try {
    // Call the centralized login method in authStore
    await authStore.login(email.value, password.value);

    // Redirect to dashboard if authenticated
    if (authStore.isAuthenticated) {
      router.push("/dashboard");
    }
  } catch (err) {
    // Handle any errors from the authStore
    error.value = authStore.error || "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  layout: "auth",
});
</script>
