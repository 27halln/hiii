FROM node:21-alpine

WORKDIR /app

COPY package*.json .
COPY . .

RUN apk update
RUN apk add python3
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm run build
EXPOSE 8080

CMD ["pnpm", "start"]
