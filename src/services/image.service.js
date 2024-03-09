const cloudinary = require("cloudinary").v2;
const Image = require("../models/images.model");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file) => {
  const image = file[0];
  const { mimetype, originalname, size } = image;

  const uploadedImages = [];
  try {
    await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            //   context: `mealType=${mealType}|foodName=${foodName}|date=${date}`, // Custom metadata properties
          },
          (error, result) => {
            if (error) {
              // Handle the error, log it, or throw it if necessary
              console.error("Error uploading image:", error);
              reject(error);
            } else {
              // Store image information in your database and associate them with the user
              // Example: Store the public_id or other relevant image information
              uploadedImages.push(result);
              resolve(result);
            }
          }
        )
        .end(image.buffer);
    });
  } catch (err) {
    // Handle the error here or rethrow it if necessary
    console.error("Error processing image:", err);
    throw err;
  }

  const newImage = await Image.create({
    imageUrl: uploadedImages[0].secure_url,
    cloudinaryId: uploadedImages[0].public_id,
    contentType: mimetype,
    originalFileName: originalname,
    size: size,
  });
  return newImage;
};

const getImageById = async (id) => {
  const image = await Image.findById(id);
  return image;
};

const getAllImages = async () => {
  const images = await Image.find();
  return images;
};

const deleteImage = async (id) => {
  const image = await Image.findById(id);
  if (!image) {
    throw new Error("Image not found");
  }
  const cloudinaryResponse = await cloudinary.uploader.destroy(
    image.cloudinaryId
  );
  if (cloudinaryResponse.result !== "ok") {
    throw new Error("Failed to delete image from Cloudinary");
  }

  await Image.findByIdAndDelete(id);
};

const updateImage = async (id, file, updateData) => {

    const image = await Image.findById(id);
    if (!image) {
      throw new Error('Image not found');
    }
  
    // Delete the old image from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);
  
    // Upload the new image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          console.error("Error uploading new image:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }).end(file.buffer);
    });
  
    // Update the MongoDB document with new image details and any additional updateData
    const updatedImage = await Image.findByIdAndUpdate(id, {
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      originalFileName: file.originalname,
      size: file.size,
      contentType: file.mimetype,
      // If updateData includes fields for the file, you can extract them as done in the uploadImage function
    }, { new: true });
  
    return updatedImage;
  };
  
module.exports = {
  getImageById,
  getAllImages,
  uploadImage,
  deleteImage,
  updateImage,
};
