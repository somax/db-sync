FROM node:10.13-alpine
LABEL maintainer="MaXiaojun<somaxj@163.com>"
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm config set registry https://registry.npm.taobao.org && npm install --production --silent && mv node_modules ../
COPY . .

CMD node index.js