export function getUploadURL(id) {
  return `/files/uploads/${id}`;
}

export function getProfileImageURL(id) {
  if (id === null) {
    return "/default-profile-picture.png";
  }

  return `/files/profile-images/${id}`;
}
