const supertest = require("supertest");
const { app } = require("../app"); // Adjust the path to your Express app
const request = supertest(app);
const { connect, disconnect } = require("./helper/database"); // Adjust the path to your database utility
require("dotenv").config();
const path = require("path");
const imagePath = path.join(__dirname, "./testImages/cat_pic_1.jpeg");

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, callback) => {
        callback(null, {
          public_id: "testStream",
          secure_url: "http://example.com/testStream.jpg",
        });
      }),
      destroy: jest.fn().mockResolvedValue({
        result: "ok",
      }),
    },
  },
}));

describe("Image CRUD operations", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  let imageId; // To store the ID of the uploaded image for later tests

  describe("/v1/image/upload", () => {
    it("should upload an image", async () => {
      const res = await request
        .post("/v1/image/upload")
        .attach("image", imagePath);

      expect(res.status).toBe(201);
      // Adjusted to check for the _id property instead of imageId
      expect(res.body).toHaveProperty("_id");

      // Save the _id for later tests, assuming this is the equivalent of what you intended by imageId
      imageId = res.body._id;

      expect(res.body).toHaveProperty("cloudinaryId", "testStream");
      expect(res.body).toHaveProperty(
        "imageUrl",
        "http://example.com/testStream.jpg"
      );
      expect(res.body).toHaveProperty("originalFileName", "cat_pic_1.jpeg");
    });
  });

  describe("/v1/image/getImage/:imageId", () => {
    it("should retrieve an image by ID", async () => {
      const res = await request.get(`/v1/image/getImage/${imageId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", imageId);
      expect(res.body).toHaveProperty("cloudinaryId");
      expect(res.body).toHaveProperty("imageUrl");
      expect(res.body).toHaveProperty("originalFileName");
    });
  });

  describe("/v1/image/getAllImages", () => {
    it("should retrieve all images", async () => {
      const res = await request.get("/v1/image/getAllImages");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("/v1/image/update/:imageId", () => {
    it("should update an image", async () => {
      const updatedImagePath = path.join(__dirname, "./testImages/cat_pic_2.jpeg");
      const public_id = "updatedImageTest";
      const secure_url = `http://example.com/${public_id}.jpg`;
      const cloudinary = require("cloudinary").v2;
      cloudinary.uploader.upload_stream.mockImplementation(
        (options, callback) => {
          callback(null, {
            public_id,
            secure_url,
          });
        }
      );

      const res = await request
        .put(`/v1/image/update/${imageId}`)
        .attach("image", updatedImagePath);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", imageId);
      expect(res.body).toHaveProperty("imageUrl", secure_url);
    });
  });

  describe("/v1/image/delete/:imageId", () => {
    let deleteImageId; // Assuming you create or have an image specifically for this delete test

    beforeAll(async () => {
      // Optionally, upload or ensure an image exists that you intend to delete
      // This is similar to your upload test but saves the ID for deletion
      const uploadResponse = await request
        .post("/v1/image/upload")
        .attach("image", imagePath);
      deleteImageId = uploadResponse.body._id; // Save the ID from the upload response
    });

    it("should verify the image exists before deletion", async () => {
      const res = await request.get(`/v1/image/getImage/${deleteImageId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", deleteImageId);
    });

    it("should delete the image", async () => {
      const deleteResponse = await request.delete(
        `/v1/image/delete/${deleteImageId}`
      );
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty(
        "message",
        "Image deleted successfully"
      );
    });

    it("should verify the image does not exist after deletion", async () => {
      const res = await request.get(`/v1/image/getImage/${deleteImageId}`);
      expect(res.status).toBe(404);
    });
  });
});
