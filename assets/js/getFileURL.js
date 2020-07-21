export function getUploadURL(id) {
  return `/files/${id}`;
}

export function getUserImageURL(id) {
  return `/api/users/${id}/image`;
}
