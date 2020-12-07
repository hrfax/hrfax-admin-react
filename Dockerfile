FROM node:10.16.3
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN apt-get update
RUN apt-get install -y make python build-essential nginx

RUN npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass

RUN npm install --registry=https://registry.npm.taobao.org

COPY . .


RUN npm run build

RUN mv ./dist/* /usr/share/nginx/html
COPY ["./docker/nginx.prod.conf",  "/etc/nginx/"]
RUN rm -f  /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443


# 这条命令由k8s去运行
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.prod.conf"]