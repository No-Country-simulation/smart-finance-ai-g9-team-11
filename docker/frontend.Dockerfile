# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Copia os arquivos de dependência
COPY frontend/package*.json ./

# Usa o npm install com a flag que ignora o conflito do React 19 com o Radix UI
RUN npm install --legacy-peer-deps

# Copia o resto do código
COPY frontend/ .

# Roda o build do Vite
RUN npx vite build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração customizada do Nginx para lidar com rotas do React Router
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]