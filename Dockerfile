FROM node:12.22.0 as builder
WORKDIR /home/node/app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn
COPY . .
RUN cp .env.example .env
RUN yarn build

FROM node:12.22.0-alpine as production
WORKDIR /home/node/app
COPY --from=builder /home/node/app/build ./build
RUN npm i -g serve
EXPOSE 5000
CMD ["serve", "-s", "build"]
