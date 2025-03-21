const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}

async function insertUser(user) {
  await prisma.user.create({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: user.password,
    },
  });
}

async function getFolderByName(name) {
  const folder = await prisma.folder.findUnique({
    where: {
      name: name,
    },
  });

  return folder;
}

async function insertFolder(folderName) {
  await prisma.folder.create({
    data: {
      name: folderName,
    },
  });
}

async function getAllFolders() {
  const folders = await prisma.folder.findMany();
  return folders;
}

module.exports = {
  prisma,
  getUserByUsername,
  getUserById,
  insertUser,
  getFolderByName,
  insertFolder,
  getAllFolders,
};
