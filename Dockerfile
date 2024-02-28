# Build stage
FROM node:lts-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN npm install -g pnpm && pnpm install && pnpm db:migrate && pnpm build

# Runner stage
FROM node:lts-alpine as runner
ENV NODE_ENV=production
ENV HUSKY=0
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.husky ./.husky
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g pnpm && pnpm install

CMD ["pnpm", "start"]