const prisma = require("../db");
const {
  createPesan,
  getallpesan
} = require("./pesan.repository");


const buatPesanan = async (data) => {
  const { userId, guestName, guestPhone, details } = data;

  if (!details || !Array.isArray(details) || details.length === 0) {
    throw new Error("Detail pesanan wajib diisi.");
  }

  // productId 
  const productIds = details.map(item => item.productId);

  // harga dari DB
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds }
    }
  });

  // map akses price by productId
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
  const pesanan = await createPesan({userId,guestName,guestPhone,detailItems,totalPrice});
  return pesanan;

};
const ambilPesanan= async()=>{
  const data = await getallpesan();
  const formatted = data.map(pesan => ({
    id: pesan.id,
    userId: pesan.userId,
    guestName: pesan.guestName,
    guestPhone: pesan.guestPhone,
    totalPrice: pesan.totalPrice,
    status: pesan.status,
    createdAt: pesan.createdAt,
    details: pesan.details.map(detail => ({
      productId: detail.productId,
      qty: detail.qty,
      price: detail.price,
      product: detail.product?.name || "Produk tidak ditemukan"
    }))
  }));

  return formatted;
}

module.exports = {
  buatPesanan,
  ambilPesanan,
};
