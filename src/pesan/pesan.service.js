const prisma = require("../db");
const {
  createPesan,
  getallpesan,
  getpesanbyId,
  updateStatusPesan
} = require("./pesan.repository");


const buatPesanan = async (data) => {
  const { userId, guestName, guestPhone, address: guestAddress, details } = data;

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

  const priceMap = {};
  products.forEach(p => {
    priceMap[p.id] = p.price;
  });

  let totalPrice = 0;

  const detailItems = details.map(item => {
    const price = priceMap[item.productId];
    if (price === undefined) {
      throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
    }

    totalPrice += price * item.qty;

    return {
      productId: item.productId,
      qty: item.qty,
      price
    };
  });

  // ✅ Ambil address dari user jika ada userId
  let finalAddress = guestAddress;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { address: true }
    });
    if (!user) throw new Error("User tidak ditemukan.");
    finalAddress = user.address;
  }

  const pesan = await createPesan({
    userId,
    guestName,
    guestPhone,
    address: finalAddress,
    totalPrice,
    detailItems
  });

  return pesan;
};

const tampilPesanan = async()=>{
  const data = await getallpesan();
  const formatted = data.map(pesan => ({
    id: pesan.id,
    userId: pesan.userId,
    userName : pesan.user?.name,
    guestName: pesan.guestName,
    guestPhone: pesan.guestPhone,
    address : pesan.address,
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
};

const tampilPesananById = async (id) => {
  const pesan = await getpesanbyId(id);

  if (!pesan) throw new Error("Pesanan tidak ditemukan");

  return {
    id: pesan.id,
    userId: pesan.userId,
    userName: pesan.user?.name,
    guestName: pesan.guestName,
    guestPhone: pesan.guestPhone,
    address: pesan.address,
    totalPrice: pesan.totalPrice,
    status: pesan.status,
    createdAt: pesan.createdAt,
    details: pesan.details?.map(detail => ({
      productId: detail.productId,
      qty: detail.qty,
      price: detail.price,
      product: detail.product?.name || "Produk tidak ditemukan"
    }))
  };
};

const ubahStatusPesanan = async (id, status) => {
  const statusValid = ["Pending", "Diproses", "Dikirim"];
  if (!statusValid.includes(status)) {
    throw new Error("Status tidak valid.");
  }

  const updated = await updateStatusPesan(id, status);
  return updated;
};
module.exports = {
  buatPesanan,
  tampilPesanan,
  tampilPesananById,
  ubahStatusPesanan
};