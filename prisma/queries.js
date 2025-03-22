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

async function insertFile(fileName, fileSize, folderId, userId) {
  await prisma.file.create({
    data: {
      name: fileName,
      size: fileSize,
      folderId: folderId,
      userId: userId,
    },
  });
}

async function getFilesOutsideFolders(userId) {
  const files = await prisma.file.findMany({
    where: {
      folderId: null,
      userId: userId,
    },
  });
  return files;
}

async function getFilesInsideFolder(folderId, userId) {
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
      userId: userId,
    },
  });

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

async function deleteFileById(id) {
  await prisma.file.delete({
    where: {
      id: id,
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

async function getAllFolders(userId) {
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
  });
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

async function deleteAllFilesInFolder(folderId) {
  await prisma.file.deleteMany({
    where: {
      folderId: folderId,
    },
  });
}

module.exports = {
  prisma,
  getUserByUsername,
  getUserById,
  insertUser,
  insertFile,
  getFilesOutsideFolders,
  getFilesInsideFolder,
  getFileById,
  deleteFileById,
  getFolderByName,
  insertFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolderById,
  deleteAllFilesInFolder,
};
