import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}", // All Vue and JavaScript/TypeScript files in the src folder
    "./components/**/*.{vue,js,ts,jsx,tsx}", // All components
    "./layouts/**/*.{vue,js,ts,jsx,tsx}", // Layout files
    "./pages/**/*.{vue,js,ts,jsx,tsx}", // Page files
    "./app.html", // Root app file
  ],
  darkMode: "selector",
  theme: {
    extend: {},
  },
  plugins: [typography, forms],
};
