import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3000,
    proxy:{
    "/api":{
      target:"http://localhost:8000",
      changeOrigin:true,
    },
    "/timeline":{
      target:"http://localhost:8003",
      changeOrigin:true,
    },
    "/auth":{
      target:"http://localhost:8001",
      changeOrigin:true,
    },
    "/posts":{
      target:"http://localhost:8002",
      changeOrigin:true,
    },
    "/user":{
      target:"http://localhost:8004",
      changeOrigin:true,
    },
    }
  }
})
