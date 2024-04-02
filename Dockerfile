FROM oven/bun:1 as base
WORKDIR /usr/src/app
COPY . .

ENV NODE_ENV=production

RUN bun install --frozen-lockfile

CMD [ "bun", "start" ]