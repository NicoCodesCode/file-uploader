const prisma = require("./prisma/prisma");

module.exports = async () => {
  await prisma.$disconnect();
};
