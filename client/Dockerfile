FROM node:20

WORKDIR /app

COPY uni_register/ ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]