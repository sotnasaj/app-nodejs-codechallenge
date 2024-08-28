# ---- Base Stage: Install Dependencies ----
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---- Build Stage: Compile TypeScript ----
FROM base AS build
WORKDIR /app
COPY . .
RUN yarn build .

# ---- Production Stage: Run Application ----
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
EXPOSE 3001
CMD ["node", "main.js"]