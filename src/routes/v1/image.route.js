const express = require("express");
const router = express.Router();
const {
  uploadImageController,
  deleteImageController,
  getAllImagesController,
  getImageController,
  updateImageController,
} = require("../../controllers/image.controller");
const uploadMiddleware = require("../../middlewares/uploadMiddleware");

router.get("/getImage/:id", getImageController);
router.get("/getAllImages", getAllImagesController);
router.post("/upload", uploadMiddleware.array("image"), uploadImageController);
router.put(
  "/update/:id",
  uploadMiddleware.array("image"),
  updateImageController
);
router.delete("/delete/:id", deleteImageController);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Image Upload, reterival and deletion API's.
 */

/**
 * @swagger
 * /v1/image/getAllImages:
 *   get:
 *     tags:
 *        - Image
 *     summary: Get all images
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 */

/**
 * @swagger
 * /v1/image/getImage/{id}:
 *   get:
 *     tags:
 *        - Image
 *     summary: Get an image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The image ID
 *     responses:
 *       200:
 *         description: An image object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       404:
 *         description: Image not found
 */

/**
 * @swagger
 * /v1/image/upload:
 *   post:
 *     tags:
 *        - Image
 *     summary: Upload an image
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 */

/**
 * @swagger
 * /v1/image/update/{id}:
 *   put:
 *     tags:
 *        - Image
 *     summary: Update an image
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The image ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image file to replace the old one
 *     responses:
 *       200:
 *         description: Image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 */

/**
 * @swagger
 * /v1/image/delete/{id}:
 *   delete:
 *     tags:
 *       - Image
 *     summary: Delete an image
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 */
