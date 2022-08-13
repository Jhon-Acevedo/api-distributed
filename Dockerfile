FROM node:14.16.0-alpine3.10
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 5001
CMD ["npm", "run", "dev"]