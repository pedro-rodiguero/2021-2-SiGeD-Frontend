FROM node:14.15.0

COPY . /app

WORKDIR /app

CMD ["sh","-c", "yarn install && yarn start"]
