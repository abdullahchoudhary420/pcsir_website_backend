FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

# Use nodemon for hot reload in development
CMD ["npx", "nodemon", "index.js"]
