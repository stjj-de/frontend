import { getRepository } from "typeorm";
import { UploadedFile } from "./data/models/UploadedFile";
import { profileImagesDirectory, uploadsDirectory } from "./utils/directories";
import Router from "@koa/router";
import send from "koa-send";
import { Context } from "koa";
import * as mimeTypes from "mime-types";

function throw404(context: Context, properties: object = {}) {
  context.throw(404, "file_not_found", properties);
}

const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // One week

const FilesRouter = new Router();

FilesRouter.get(
  "/files/profile-images/:id",
  context => send(context, context.params.id, {
    root: profileImagesDirectory,
    maxAge: MAX_AGE
  }),
  context => throw404(context)
);

FilesRouter.get(["/files/uploads/:id", "/files/uploads/:id/(.*)"], async context => {
  const uploadedFileRepository = getRepository<UploadedFile>(UploadedFile);
  const { id } = context.params;

  const uploadedFile = await uploadedFileRepository.findOne(id);

  if (uploadedFile === undefined) {
    throw404(context, { id });
    return;
  }

  const suffix = uploadedFile.mimeType === null ? "" : (`.${mimeTypes.extension(uploadedFile.mimeType)}`);
  const pathParts = context.path.split("/");
  const filename = encodeURI(uploadedFile.title) + suffix;

  const givenFilename = pathParts[pathParts.length - 1];
  if (pathParts.length === 5 && filename === givenFilename) {
    await send(context, id, {
      maxAge: MAX_AGE,
      root: uploadsDirectory,
      setHeaders: response => {
        response.setHeader("Content-Type", uploadedFile.mimeType ?? "application/octet-stream");
      }
    });
  } else {
    context.status = 302;
    context.redirect(`/files/uploads/${String(id)}/${filename}`);
  }
});

FilesRouter.get("/f/:alias", async context => {
  const uploadedFileRepository = getRepository<UploadedFile>(UploadedFile);
  const { alias } = context.params;

  const uploadedFile = await uploadedFileRepository.findOne({ alias });

  if (uploadedFile === undefined) {
    context.throw(404, "file_not_found", { alias });
    return;
  }

  context.status = 302;
  context.redirect(`/files/uploads/${uploadedFile.id}`);
});

FilesRouter.all(["/f/(.+)", "/files/(.+)"], context => throw404(context));

export { FilesRouter };
