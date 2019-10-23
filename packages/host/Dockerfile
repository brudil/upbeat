FROM node:12-alpine

WORKDIR /pack

# We only copy the dependencies we need
#COPY packages/package1 packages/package1
#COPY packages/package3 packages/package3

#COPY services/services1 services/services1

# The global package.json only contains build dependencies
COPY package.json .

COPY yarn.lock .

COPY . .

RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

EXPOSE 3000

CMD npm start
