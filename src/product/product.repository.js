const prisma = require("../db");
const path = require("path");
// Insert product 
const insertproduct = async (productData) => {
    return await prisma.product.create({
        data: {
            name: productData.name,
            price: parseFloat(productData.price),
            image: productData.image?path.basename(productData.image) : null,
            categoryId: productData.categoryId, 
        },
        include: { category: true },
    });
};
// Find all products (Include category)
const findproduct = async () => {
    const products = await prisma.product.findMany({
        include: { category: true } 
    });
    return products;
};

// Find product by ID (Include category)
const findproductbyId = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true } 
    });

    return product;
};

// Edit product
const updateproduct = async (id, updateData) => {
    return await prisma.product.update({
        where: { id },
        data: {
            name: updateData.name,  // Tidak ada spasi di sini
            price: parseFloat(updateData.price), // Pastikan price dikonversi ke angka
            image: updateData.image,
            categoryId: updateData.categoryId,
        },
        include: { category: true },
    });
};

// Delete product
const deleteproduct = async (id) => {
    await prisma.product.delete({
        where: { id }
    });
};

module.exports = {
    insertproduct,
    findproduct,
    findproductbyId,
    deleteproduct,
    updateproduct
};
