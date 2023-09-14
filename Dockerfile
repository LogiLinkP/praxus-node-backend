# etapa 1: instalar dependencias y compilar la app
FROM node:18
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY . .
RUN npm run build
RUN mkdir /app/dist/cert
COPY ./cert/ca-certificates.crt /app/dist/cert/ca-certificates.crt
COPY ./cert/cert1.pem /app/dist/cert/cert1.pem
COPY ./cert/privkey1.pem /app/dist/cert/privkey1.pem
COPY ./.env /app/dist/.env
EXPOSE 3000
EXPOSE 5000
CMD ["node", "dist/index.js"]