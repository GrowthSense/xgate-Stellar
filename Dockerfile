FROM node:18  

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production
# RUN npm install -g @nestjs/cli

COPY . .

CMD ["npm", "run", "start"]
