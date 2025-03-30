const prisma = require("../db");
const {
    insertproduct,
    findproduct,
    findproductbyId,
    deleteproduct,
    updateproduct
} = require("./product.repository");

// Create new product
const createProduct = async (newProductData) => {
    const category = await prisma.category.findUnique({
        where: { name: newProductData.category },
    });

    if (!category) {
        throw new Error("Kategori tidak ditemukan");
    }

    const productData = {
        ...newProductData,
        categoryId: category.id, 
    };

    return await insertproduct(productData);
};
// Get all products
const getAllProduct = async () => {
    const products = await findproduct();
    return products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryId: product.categoryId,
        category: product.category.name
    }));
};

// Get product by ID
const getproductbyId = async (id) => {
    const product = await findproductbyId(id);
    if (!product) {
        throw new Error("Produk tidak ditemukan");
    }
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryId: product.categoryId,
        category: product.category.name
    };
};

// Update product 
const updateProductById = async (id, updateData) => {
    const product = await findproductbyId(id);
    if (!product) {
        throw new Error("Produk tidak ditemukan");
    }

    if (updateData.category) {
        const category = await prisma.category.findUnique({
            where: { name: updateData.category },
        });
        if (!category) {
            throw new Error("Kategori tidak ditemukan");
        }
        updateData.categoryId = category.id;
        delete updateData.category;
    }

    return await updateproduct(id, updateData);
};


// Delete product by ID
const deleteproductbyId = async (id) => {
    const product = await findproductbyId(id);
    if (!product) {
        throw new Error("Produk tidak ditemukan");
    }
    await deleteproduct(id);
};

module.exports = {
    createProduct,
    getAllProduct,
    getproductbyId,
    deleteproductbyId,
    updateProductById
};
