const prisma = require("../db");

const getAllCategories = async(req,res)=>{
    try{
        const categories = await prisma.category.findMany();
        res.json({
            data:categories
        });
    }catch(error){
        console.error("gagal mengambil kategori",error);
        res.status(500).json({
            error:"terjadi kesalahan saat mengambil kategori"
        });
    }
};

module.exports ={getAllCategories};