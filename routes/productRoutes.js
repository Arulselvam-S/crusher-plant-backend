const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../middleware/uploads");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD PRODUCT WITH IMAGE
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.file
          ? `/uploads/${req.file.filename}`
          : "",
        status:
          req.body.status || "Available",
      });

      const savedProduct =
        await product.save();

      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
);

// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;