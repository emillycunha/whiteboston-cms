import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

export default {
  content: [
    "./pages/**/*.{vue,js,ts,jsx,tsx}", // Include all files in the pages directory
    "./components/**/*.{vue,js,ts,jsx,tsx}", // Include all files in the components directory
    "./layouts/**/*.{vue,js,ts,jsx,tsx}", // Include layouts if you have them
    "./app.vue", // Include root app.vue if present
  ],
  darkMode: "selector",
  theme: {
    extend: {},
  },
  plugins: [typography, forms],
};
