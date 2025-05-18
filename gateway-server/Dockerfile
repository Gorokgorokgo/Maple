# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# 1-1) package-lock.json / package.json
COPY package*.json ./
# 1-2) 타입스크립트 설정
COPY tsconfig*.json ./
# 1-3) 소스 코드
COPY src ./src

# 1-4) 의존성 설치 & 빌드
RUN npm ci
RUN npm run build   # NestJS: tsc → dist/

# 2) Run stage
FROM node:18-alpine AS runner
WORKDIR /app

# 2-1) production only
COPY package*.json ./
RUN npm ci --only=production

# 2-2) 빌드 산출물 복사
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# NestJS 앱 기동
CMD ["node", "dist/main.js"]
