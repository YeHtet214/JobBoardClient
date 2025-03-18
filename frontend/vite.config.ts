import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Define the type for the tailwindcss plugin options
interface TailwindCSSOptions {
  config?: string;
  applyDirectives?: boolean;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Cast the function to accept options
    (tailwindcss as unknown as (options?: TailwindCSSOptions) => any)({
      config: './tailwind.config.js',
      applyDirectives: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
