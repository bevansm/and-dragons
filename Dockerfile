FROM node:current-alpine3.12

WORKDIR /usr/src/app/
COPY package*.json ./
RUN npm i 

COPY . .
RUN npm run build
RUN npm prune --production

CMD [ "npm", "run", "start:prod" ]
