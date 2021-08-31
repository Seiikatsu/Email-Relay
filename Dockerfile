# Common build stage
FROM node:latest

WORKDIR /usr/src/app

# copy project
COPY dist/ /usr/src/app
COPY node_modules /usr/src/app/node_modules

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

CMD ["node", "server.js"]
