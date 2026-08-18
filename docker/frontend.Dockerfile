# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency files
COPY frontend/package*.json ./

# Install exact dependencies from package-lock.json
RUN npm ci --legacy-peer-deps

# Copy frontend source code
COPY frontend/ .

# Build the production application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Nginx configuration for React Router
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]