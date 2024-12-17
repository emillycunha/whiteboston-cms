<template>
  <div class="quote-card">
    <p class="quote">{{ quote }}</p>
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
