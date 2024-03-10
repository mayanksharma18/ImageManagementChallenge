const {
  uploadImage,
  updateImage,
  deleteImage,
  getAllImages,
  getImageById,
} = require("../services/image.service");

const uploadImageController = async (req, res) => {
  try {
    const image = await uploadImage(req.files);
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImageController = async (req, res) => {
  try {
    const image = await getImageById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllImagesController = async (req, res) => {
  try {
    const images = await getAllImages();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateImageController = async (req, res) => {
    try {
      const updatedImage = await updateImage(req.params.id, req.files[0]);
      res.json(updatedImage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const deleteImageController = async (req, res) => {
  try {
    await deleteImage(req.params.id);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getImageController,
  getAllImagesController,
  uploadImageController,
  updateImageController,
  deleteImageController,
};
