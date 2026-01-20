release: npm run db:generate --prefix backend && npm run db:push --prefix backend && npm run db:seed --prefix backend
web: npm install --prefix backend --production=false && npm install --prefix frontend && npm run build --prefix backend && npm run build --prefix frontend && node backend/dist/server.js




