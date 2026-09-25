FROM node:24-slim
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm install
COPY . ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node app.js"]