<template>
  <div class="quote-card">
    <p class="text-base font-semibold p-2 text-gray-700 italic">{{ quote }}</p>
  </div>
</template>

<script setup>
import quotes from "@/assets/quotes.json";

const today = new Date();
const dayOfYear = Math.floor(
  (today - new Date(today.getFullYear(), 0, 0)) / 86400000
);
const quote = quotes[dayOfYear % quotes.length].quote;
</script>
