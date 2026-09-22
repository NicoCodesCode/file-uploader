const Minio = require("minio");

const garageClient = new Minio.Client({
  endPoint: "garage",
  port: 3900,
  useSSL: false,
  accessKey: process.env.GARAGE_DEFAULT_ACCESS_KEY,
  secretKey: process.env.GARAGE_DEFAULT_SECRET_KEY,
});

module.exports = garageClient;
