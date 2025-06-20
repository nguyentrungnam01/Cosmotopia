import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem'))
    // }
  }
});
