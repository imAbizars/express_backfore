const prisma = require("../db");

const createPesan = async ({ userId, guestName, guestPhone,address, totalPrice, detailItems }) => {
  return await prisma.pesan.create({
    data: {
      userId: userId || null,
      guestName,
      guestPhone,
      address,
      totalPrice,
      details: {
        create: detailItems
      }
    },
    include: {
      details: true
    }
  });
};
const getallpesan = async()=>{
  const pesanan = await prisma.pesan.findMany({
    include:{
      details:{
        include:{
          product:true
        }
      }
    }
  });
  return pesanan
}
module.exports = {
  createPesan,
  getallpesan
};
