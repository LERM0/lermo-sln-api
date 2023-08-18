# Build Stage
FROM node:16.20.2 AS build
WORKDIR /app
COPY ./ /app
RUN yarn
RUN yarn run build

# Run Stage
FROM node:16.20.2
WORKDIR /app
COPY --from=build /app /app
ENTRYPOINT node dist/main