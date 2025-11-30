FROM node:20

WORKDIR /app

COPY node/package.json node/package-lock.json ./

RUN npm install

COPY node/ ./

EXPOSE 3001

CMD ["npm", "start"]