FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm ci --only=production
RUN useradd app && chown -R app /usr/src/app
USER app
COPY . .
EXPOSE 8000
CMD [ "node", "server/server.js" ]

