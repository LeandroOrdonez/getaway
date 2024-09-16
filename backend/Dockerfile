# backend/Dockerfile
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod 755 uploads 

EXPOSE 3000

CMD ["npm", "start"]