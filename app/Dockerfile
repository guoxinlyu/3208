# ---- Build stage ----
FROM node:20-alpine AS build          # node:20 更稳，22 也可如果项目已验证
WORKDIR /app
COPY package*.json ./
# 用 BuildKit 缓存 + 关掉 audit/fund，加速安装
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
RUN npm run build                      # 确保 package.json 有 "build": "vite build"

# ---- Runtime stage (Nginx 静态托管) ----
FROM nginx:1.27-alpine                 # 固定小版本，结果更可预期
# 覆盖默认站点配置（关键！）
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 只拷贝构建产物
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
