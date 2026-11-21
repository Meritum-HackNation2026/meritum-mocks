# syntax=docker/dockerfile:1
# Node 26 runs src/*.ts directly; tsx adds the JSX of src/channels (react-dom/server), so
# there is no build step.
FROM node:26-slim
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install --global "$(node -p "require('./package.json').packageManager")" \
 && pnpm install --frozen-lockfile --prod
# tsconfig.json: tsx reads "jsx": "react-jsx" from it.
COPY tsconfig.json ./
COPY src ./src
COPY platforms ./platforms
COPY copy ./copy
COPY tokens ./tokens
COPY brand ./brand
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "--import", "tsx", "src/server.ts"]
