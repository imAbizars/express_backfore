const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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
const { isAdmin } = require("../../middleware/auth");

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
router.patch("/:id",upload.single("image"), async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        const existingProduct = await getproductbyId(productId);

        // jika produk tidak ditemukan, hapus file yang baru di-upload 
        if (!existingProduct) {
            if (req.file) {
                const uploadedFilePath = path.join(uploadDir, req.file.filename);
                await fs.promises.unlink(uploadedFilePath);
                console.warn(`Produk tidak ditemukan. File ${req.file.filename} telah dihapus.`);
            }
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        const updateData = { ...req.body };

        // jika ada file baru, hapus file lama 
        if (req.file) {
            if (existingProduct.image) {
                const oldImagePath = path.join(uploadDir, existingProduct.image);
                try {
                    await fs.promises.unlink(oldImagePath);
                    console.log(`Gambar lama ${existingProduct.image} berhasil dihapus`);
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error("Gagal menghapus gambar lama:", err.message);
                    }
                }
            }

            updateData.image = req.file.filename; // update dengan gambar baru
        }

        const updatedProduct = await updateProductById(productId, updateData);
        res.status(200).json({
            data: updatedProduct,
            message: "Produk berhasil diperbarui"
        });
    } catch (error) {
        console.error("PATCH error:", error.message);

        // error dan ada file yang sudah di-upload, hapus file itu
        if (req.file) {
            const uploadedFilePath = path.join(uploadDir, req.file.filename);
            try {
                await fs.promises.unlink(uploadedFilePath);
                console.warn(`Error terjadi. File ${req.file.filename} dihapus.`);
            } catch (err) {
                console.error("Gagal menghapus file upload:", err.message);
            }
        }

        res.status(400).json({ message: error.message });
    }
});

// DELETE product by ID
router.delete("/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);

        // Ambil data produk yang ada sebelum dihapus
        const product = await getproductbyId(productId);

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Hapus gambar dari folder jika ada
        if (product.image) {
            const filePath = path.join(uploadDir, product.image);

            try {
                await fs.promises.unlink(filePath);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.warn(`File not found, skipping deletion: ${filePath}`);
                } else {
                    console.error(`Error deleting file: ${error.message}`);
                }
            }
        }

        // Hapus entri dari database
        await deleteproductbyId(productId);

        res.send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error); // Log error untuk debugging
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
