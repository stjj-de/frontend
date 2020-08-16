export function getUploadURL(id) {
  return `/files/${id}`
}

export function getUserImageURL(imageID) {
  return imageID ? getUploadURL(imageID) : "/default-profile-picture.png"
}
