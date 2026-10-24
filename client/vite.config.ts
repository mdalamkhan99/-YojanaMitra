import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react'; import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss(),{name:'startup-url',configureServer(server){server.httpServer?.once('listening',()=>console.log('YojanaMitra client http://localhost:5173'));}}],server:{strictPort:true,proxy:{'/api':'http://localhost:4000'}}});
