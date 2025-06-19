FROM node:20-alpine AS builder
WORKDIR /app

COPY uni_register/package*.json ./

RUN npm install

COPY uni_register/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]