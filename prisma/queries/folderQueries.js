const prisma = require("../prisma");

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

async function getFolderByName(name) {
  const folder = await prisma.folder.findUnique({
    where: {
      name: name,
    },
  });

  return folder;
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
  insertRootFolder,
  insertSubfolder,
  getFolderByName,
  getAllRootFolders,
  getAllSubfolders,
  getFolderById,
  updateFolder,
  deleteFolderById,
  deleteAllSubfolders,
};
