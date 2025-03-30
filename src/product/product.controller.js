const express = require("express");
const multer = require("multer");
const path = require("path");

// upload gambar
const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});
const upload = multer({ storage });

const {
    createProduct,
    getAllProduct,
    getproductbyId,
    deleteproductbyId,
    updateProductById
} = require("./product.service");

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await getAllProduct();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET product by ID
router.get("/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await getproductbyId(productId);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST new product
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const newProductData = {
            ...req.body,
            image: req.file.filename
        };

        const product = await createProduct(newProductData);
        res.status(201).json({
            data: product,
            message: "Success upload"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// PATCH product
router.patch("/:id", upload.single("image"), async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedProduct = await updateProductById(productId, updateData);
        res.status(200).json({
            data: updatedProduct,
            message: "Produk berhasil diperbarui"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// DELETE product by ID
router.delete("/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        await deleteproductbyId(productId);
        res.status(200).json({ message: "Data berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
