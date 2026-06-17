const repo = require("./user.repository");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getUser = async (id) => {
  return repo.findById(id);
};

function extractCloudinaryPublicId(url, cloudName) {
  try {
    if (!url) return null;
    // Only handle Cloudinary hosted urls for configured cloudName
    if (cloudName && !url.includes(`res.cloudinary.com/${cloudName}`)) return null;
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let after = parts[1];
    // remove query string
    after = after.split('?')[0];
    // remove version prefix v12345/
    after = after.replace(/^v\d+\//, '');
    // remove file extension
    const lastDot = after.lastIndexOf('.');
    if (lastDot > -1) after = after.substring(0, lastDot);
    return after;
  } catch (e) {
    return null;
  }
}

exports.updateUser = async (id, data) => {
  // If avatar is being updated, attempt to delete previous Cloudinary asset
  if (data && data.avatar) {
    try {
      const existing = await repo.findById(id);
      const prevAvatar = existing && existing.avatar;
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const publicId = extractCloudinaryPublicId(prevAvatar, cloudName);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      }
    } catch (err) {
      // log but do not block profile update
      console.error('Failed to delete previous Cloudinary image', err);
    }
  }

  return repo.update(id, data);
};