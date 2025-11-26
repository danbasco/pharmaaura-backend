FROM node:18
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --production --silent || npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
