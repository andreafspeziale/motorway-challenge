FROM node:16.13-alpine as base

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
RUN mkdir /opt/api && chown -R node:node /opt/api
WORKDIR /opt/api
USER node
COPY --chown=node:node package*.json ./
RUN npm set-script prepare ""

FROM base as dependencies
ENV NODE_ENV development
COPY --chown=node:node . .
RUN npm ci

FROM dependencies as tester
ENV NODE_ENV test
CMD ["npm", "run", "test"]

FROM dependencies as builder
RUN npm run build

FROM base as runner
ENV NODE_ENV production
RUN npm ci
COPY --from=builder --chown=node:node /opt/api/dist /opt/api/dist
CMD ["npm", "run", "start:prod"]
