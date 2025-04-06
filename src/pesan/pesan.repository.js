const prisma = require("../db");

const createPesan = async ({ userId, guestName, guestPhone, totalPrice, detailItems }) => {
  return await prisma.pesan.create({
    data: {
      userId: userId || null,
      guestName,
      guestPhone,
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

module.exports = {
  createPesan,
};
