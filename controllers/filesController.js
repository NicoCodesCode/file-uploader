const {
  insertFileInFolder,
  insertFileInRoot,
  getFileById,
  deleteFileById,
} = require("../prisma/queries/fileQueries");
const { format } = require("date-fns");

const upload = require("../storage/upload");
const garage = require("../storage/garage");

const renderUploadFilePage = (req, res) => {
  res.render("uploadFileForm", {
    title: "Upload a File",
    actionPath: req.params.folderId
      ? `/folders/${req.params.folderId}/upload`
      : `/files/upload`,
    errors: req.errors ? req.errors : [],
  });
};

const uploadFile = [
  upload.single("file"),
  async (req, res, next) => {
    if (!req.file) {
      req.errors = [{ msg: "Could not upload the file" }];
      return next();
    }

    try {
      const fileBuffer = req.file.buffer;
      const uniqueName = `${Date.now()}_${req.file.originalname}`;
      const fileSize = req.file.size;
      const mimeType = req.file.mimetype;

      await garage.putObject(
        process.env.GARAGE_DEFAULT_BUCKET,
        uniqueName,
        fileBuffer,
        fileSize,
      )

      if (req.params.folderId) {
        await insertFileInFolder(
          uniqueName,
          req.file.size,
          req.params.folderId ? Number(req.params.folderId) : undefined,
          res.locals.currentUser.id,
          uniqueName,
          mimeType
        );

        return res.redirect(`/folders/${req.params.folderId}`);
      }

      await insertFileInRoot(
        uniqueName,
        req.file.size,
        res.locals.currentUser.id,
        uniqueName,
        mimeType
      );

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
  renderUploadFilePage,
];

const viewDetails = async (req, res, next) => {
  try {
    const file = await getFileById(Number(req.params.fileId));
    res.render("fileDetails", { title: "File Details", file, format });
  } catch (error) {
    next(error);
  }
};

const downloadFile = async (req, res, next) => {
  const file = await getFileById(Number(req.params.fileId));

  try {
    const stream = await garage.getObject(process.env.GARAGE_DEFAULT_BUCKET, file.name)

    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", file.mimeType);

    stream.pipe(res)
  } catch (error) {
    next(error);
  }
};

const renderDeleteFilePage = (req, res) => {
  res.render("delete", {
    title: "Delete File",
    fileId: req.params.fileId,
    actionPath: `/files/${req.params.fileId}`,
    alertMessage: "file",
  });
};

const deleteFile = async (req, res, next) => {
  try {
    const fileId = Number(req.params.fileId);
    const { name: fileName } = await getFileById(fileId);

    await garage.removeObject(process.env.GARAGE_DEFAULT_BUCKET, fileName)

    await deleteFileById(fileId);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renderUploadFilePage,
  uploadFile,
  viewDetails,
  downloadFile,
  renderDeleteFilePage,
  deleteFile,
};
