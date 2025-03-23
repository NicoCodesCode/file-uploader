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

async function getFolderByName(name) {
  const folder = await prisma.folder.findUnique({
    where: {
      name: name,
    },
  });

  return folder;
}

async function insertRootFolder(folderName, userId) {
  await prisma.folder.create({
    data: {
      name: folderName,
      User: {
        connect: { id: userId },
      },
    },
  });
}

async function insertSubfolder(folderName, parentFolderId, userId) {
  await prisma.folder.create({
    data: {
      name: folderName,
      User: {
        connect: { id: userId },
      },
      parent: {
        connect: { id: parentFolderId },
      },
    },
  });
}

async function getAllRootFolders(userId) {
  const folders = await prisma.folder.findMany({
    where: {
      parentId: null,
      userId: userId,
    },
  });
  return folders;
}

async function getAllSubfolders(parentFolderId, userId) {
  const folders = await prisma.folder.findMany({
    where: {
      parentId: parentFolderId,
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

async function deleteAllSubfolders(parentFolderId) {
  const subfolders = await prisma.folder.findMany({
    where: {
      parentId: parentFolderId,
    },
  });

  for (const subfolder of subfolders) {
    await deleteAllFilesInFolder(subfolder.id);
    await deleteAllSubfolders(subfolder.id);
  }

  await prisma.folder.deleteMany({
    where: {
      parentId: parentFolderId,
    },
  });
}

module.exports = {
  prisma,
  getUserByUsername,
  getUserById,
  insertUser,
  insertFileInRoot,
  insertFileInFolder,
  getFilesOutsideFolders,
  getFilesInsideFolder,
  getFileById,
  deleteFileById,
  getFolderByName,
  insertRootFolder,
  insertSubfolder,
  getAllRootFolders,
  getAllSubfolders,
  getFolderById,
  updateFolder,
  deleteFolderById,
  deleteAllFilesInFolder,
  deleteAllSubfolders,
};
