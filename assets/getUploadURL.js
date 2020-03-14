export function getUploadURL(id) {
  // return `/uploads/${id}`;
  return `https://i.pravatar.cc/150?u=${id}`;
}

export function getImageURL(id) {
  if (id === null) {
    return "/default_profile_picture.png";
  }

  return getUploadURL(id);
}
