FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Libgl required to optimize images
RUN apt-get update && apt-get install -y nano
RUN npm install nuxt
# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "run",  "dev"]
