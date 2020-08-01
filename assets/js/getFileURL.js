export function getUploadURL(id) {
  return `/files/${id}`;
}

export function getUserImageURL(imageID) {
  return !imageID ? "/default-profile-picture.png" : getUploadURL(imageID);
}
