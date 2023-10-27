FROM node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 3002

COPY package*.json ./

RUN npm install

RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

CMD node dist/main
