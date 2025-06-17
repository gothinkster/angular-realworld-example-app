FROM node:20.19.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install -g @angular/cli

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]