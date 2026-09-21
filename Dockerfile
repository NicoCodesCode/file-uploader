FROM node:20-slim
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm install
COPY . ./

EXPOSE 3000

CMD ["node", "app.js"]