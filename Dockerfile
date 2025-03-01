FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src
COPY ["package.json", "package-lock.json*", ".env", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ./
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src
USER node
CMD ["npm", "run", "start:prod"]
