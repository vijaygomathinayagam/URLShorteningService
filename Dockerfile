FROM node

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD [ "node", "index.js" ]
