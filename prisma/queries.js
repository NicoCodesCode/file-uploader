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

async function insertFile(fileName, userId) {
  await prisma.file.create({
    data: {
      name: fileName,
      userId: userId,
    },
  });
}

async function getAllFiles() {
  const files = await prisma.file.findMany();
  return files;
}

async function getFileById(id) {
  const file = await prisma.file.findUnique({
    where: {
      id: id,
    },
  });

  return file;
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

async function getFolderById(id) {
  const folder = await prisma.folder.findUnique({
    where: {
      id: id,
    },
  });

  return folder;
}

async function updateFolder(id, name) {
  await prisma.folder.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });
}

async function deleteFolderById(id) {
  await prisma.folder.delete({
    where: {
      id: id,
    },
  });
}

module.exports = {
  prisma,
  getUserByUsername,
  getUserById,
  insertUser,
  insertFile,
  getAllFiles,
  getFileById,
  getFolderByName,
  insertFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolderById,
};
