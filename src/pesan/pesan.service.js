const prisma = require("../db");

const buatPesanan = async (data) => {
  const { userId, guestName, guestPhone, details } = data;

  if (!details || !Array.isArray(details) || details.length === 0) {
    throw new Error("Detail pesanan wajib diisi.");
  }

  // Ambil semua productId unik
  const productIds = details.map(item => item.productId);

  // Ambil harga dari DB
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds }
    }
  });

  // Buat map untuk cepat akses price by productId
  const priceMap = {};
  products.forEach(p => {
    priceMap[p.id] = p.price;
  });

  let totalPrice = 0;

  const detailData = details.map(item => {
    const price = priceMap[item.productId];
    if (price === undefined) {
      throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
    }

    const itemTotal = price * item.qty;
    totalPrice += itemTotal;

    return {
      productId: item.productId,
      qty: item.qty,
      price
    };
  });

  const pesan = await prisma.pesan.create({
    data: {
      userId: userId || null,
      guestName,
      guestPhone,
      totalPrice,
      details: {
        create: detailData
      }
    },
    include: {
      details: true
    }
  });

  return pesan;
};

module.exports = {
  buatPesanan
};
