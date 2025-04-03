import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react(),
  ],

  build: {
    lib: {
      entry: 'src/lib/index.js',       // ورودی اصلی کتابخانه
      name: 'NilfamEditor',            // نام UMD global در صورت نیاز
      fileName: (format) => `nilfam-editor.${format}.js` // اسم فایل خروجی
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      }
    }
  }
})
