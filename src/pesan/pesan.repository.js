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
  });
};

const getallpesan = async()=>{
  const pesanan = await prisma.pesan.findMany({
    include:{
      user:{
        select:{
          name:true
        }
      },
      details:{
        include:{
          product:true
        }
      }
    },
    orderBy:{
      createdAt:"desc"
    }
  });
  return pesanan;
};
const getpesanbyId = async(id)=>{
  return await prisma.pesan.findUnique({
    where:{
      id
    },
    include:{
      user:{
        select: {
          name: true
        }
      },
      details: {
        include: {
          product: true
        }
      }
    }
  });
};
const updateStatusPesan = async(id,status)=>{
  const statuspesan = await prisma.pesan.update({
    where:{
      id,
    },
    data:{
      status,
    }
  });
  return statuspesan;
};
module.exports = {
  createPesan,
  getallpesan,
  updateStatusPesan,
  getpesanbyId
};