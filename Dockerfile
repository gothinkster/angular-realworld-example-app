FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN npm install -g @angular/cli

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4200

CMD [ "ng", "serve" ]

