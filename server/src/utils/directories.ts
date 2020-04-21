import path from "path";

export const dataDirectory = process.env.DATA_DIR;

if (dataDirectory === undefined) {
  throw new Error("DATA_DIR environment variable is not defined.");
}

export const profileImagesDirectory = path.resolve(dataDirectory, "profile-images");
export const uploadsDirectory = path.resolve(dataDirectory, "uploads");
