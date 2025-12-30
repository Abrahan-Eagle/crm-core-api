FROM node:20-slim
ENV PORT 8080
EXPOSE 8080
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build && npm prune --production
CMD [ "npm", "run", "start:prod" ]