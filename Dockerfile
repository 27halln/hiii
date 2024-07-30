FROM node:21-alpine

WORKDIR /app

COPY package*.json .
COPY . .

RUN apk update
RUN apk add python3 py3-pip
RUN python3 -m pip install setuptools --break-system-packages
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm run build
EXPOSE 8080

CMD ["pnpm", "start"]
