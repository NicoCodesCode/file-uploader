const prisma = require("../prisma");

async function insertFileInRoot(fileName, fileSize, userId, fileUrl) {
  await prisma.file.create({
    data: {
      name: fileName,
      size: fileSize,
      User: {
        connect: { id: userId },
      },
      url: fileUrl,
    },
  });
}

async function insertFileInFolder(
  fileName,
  fileSize,
  folderId,
  userId,
  fileUrl
) {
  await prisma.file.create({
    data: {
      name: fileName,
      size: fileSize,
      Folder: {
        connect: { id: folderId },
      },
      User: {
        connect: { id: userId },
      },
      url: fileUrl,
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

async function deleteAllFilesInFolder(folderId) {
  await prisma.file.deleteMany({
    where: {
      folderId: folderId,
    },
  });
}

module.exports = {
  insertFileInRoot,
  insertFileInFolder,
  getFilesOutsideFolders,
  getFilesInsideFolder,
  getFileById,
  deleteFileById,
  deleteAllFilesInFolder,
};
