# Etapa 1: Builder - Instala dependencias y copia el código fuente
FROM node:18-alpine AS builder

WORKDIR /app

# Copia package.json y package-lock.json para aprovechar el caché de Docker
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm ci --only=production

# Copia el resto del código de la aplicación
COPY . .

# Etapa 2: Runner - Crea la imagen final y optimizada
FROM node:18-alpine

WORKDIR /app

# Copia la aplicación y las dependencias de la etapa anterior
COPY --from=builder /app .

# Expone el puerto que utiliza tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]
