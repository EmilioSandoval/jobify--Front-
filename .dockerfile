# imagen para basarse
FROM node:20-alpine3.20

# Crear carpeta de trabajo
WORKDIR /app

# Copiar a mi carpeta de trabajo
COPY package.json ./
COPY package*.json ./

# Correr comando para inicializar
RUN npm install

# Copiar el contenido
COPY . . 

# Exponer puerto
EXPOSE 3000

# Ejecutar aplicación
CMD ["npm","run","dev"]
