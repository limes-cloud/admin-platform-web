FROM node AS builder
WORKDIR /app/

# 节省构建时间
ADD package.json /app/

# 设置 yarn 用淘宝源安装包
RUN pnpm config set registry=https://registry.npmmirror.com/

ADD . /app/

RUN pnpm build


# 基础镜像
FROM nginx
# 删除原有的nginx.conf文件
RUN rm /etc/nginx/conf.d/nginx.conf
# 增加自定义nginx.conf文件到对应目录
ADD nginx.conf /etc/nginx/conf.d/
# 将dist目录下的文件复制到nginx内的目录下，与上文对应
COPY --from=builder app/dist/ /usr/share/nginx/html/
