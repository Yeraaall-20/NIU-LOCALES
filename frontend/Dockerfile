# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Install dependencies
RUN npm ci

# Copy source
COPY src ./src
COPY public ./public
COPY index.html ./

# Build
RUN npm run build

# Runtime stage - use nginx to serve the built app
FROM nginx:alpine

# Copy custom nginx configuration
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
