web: npm install --prefix backend --production=false && npm install --prefix frontend && npm run db:push --prefix backend && npm run db:seed --prefix backend && npm run build --prefix backend && VITE_API_URL=http://localhost:4000/api npm run build --prefix frontend && node backend/dist/server.js


