const upload = require("../storage/upload");
const {
  insertFileInFolder,
  insertFileInRoot,
  getFileById,
  deleteFileById,
} = require("../prisma/queries/fileQueries");
const { format } = require("date-fns");
const supabase = require("../storage/supabase");

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
      const filePath = `uploads/${uniqueName}`;
      const mimeType = req.file.mimetype;

      const { data, error } = await supabase.storage
        .from("file-uploader-bucket")
        .upload(filePath, fileBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: mimeType,
        });

      if (error) {
        console.error(error);
        throw new Error("Could not upload the file");
      }

      const { publicUrl } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath).data;

      if (req.params.folderId) {
        await insertFileInFolder(
          uniqueName,
          req.file.size,
          req.params.folderId ? Number(req.params.folderId) : undefined,
          res.locals.currentUser.id,
          publicUrl,
          mimeType
        );

        return res.redirect(`/folders/${req.params.folderId}`);
      }

      await insertFileInRoot(
        uniqueName,
        req.file.size,
        res.locals.currentUser.id,
        publicUrl,
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
  const filePath = `uploads/${file.name}`;

  try {
    const { data, error } = await supabase.storage
      .from("file-uploader-bucket")
      .download(filePath);

    if (error) {
      console.error(error);
      throw new Error("Could not download the file");
    }

    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", file.mimeType);

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.send(buffer);
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

    const { data, error } = await supabase.storage
      .from("file-uploader-bucket")
      .remove([`uploads/${fileName}`]);

    if (error) {
      console.error(error);
      throw new Error("Could not upload the file");
    }

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
