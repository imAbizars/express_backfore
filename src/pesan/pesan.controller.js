const express = require("express");
const router = express.Router();
const { 
  buatPesanan,
  tampilPesanan,
  tampilPesananById,
  ubahStatusPesanan
 } = require("./pesan.service");
//post

router.post("/", async (req, res) => {
  try {
    const user = req.session.user;
    const pesanData = req.body;

    // Validasi detail pesanan
    if (
      !pesanData.details ||
      !Array.isArray(pesanData.details) ||
      pesanData.details.length === 0
    ) {
      return res.status(400).json({ message: "Detail pesanan wajib diisi." });
    }

    // Handle guest atau user login
    if (user) {
      pesanData.userId = user.id;
    } else {
      // Guest harus isi nama, phone, dan alamat
      if (!pesanData.guestName || !pesanData.guestPhone || !pesanData.address) {
        return res.status(400).json({ message: "Data tamu wajib diisi (guestName, guestPhone, address)." });
      }
    }

    const buatPesan = await buatPesanan(pesanData);

    res.status(201).json({
      data: buatPesan,
      message: "Pesanan berhasil dibuat",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get
router.get("/",async(req,res)=>{
  try{
    const pesanan = await tampilPesanan();
    res.status(201).json(pesanan);
  }catch(error){
    res.status(400).json({
      message:error.message
    });
  };
});

//getbyId
router.get("/:id",async(req,res)=>{
  try{
    const pesanId = parseInt(req.params.id);
    const pesanan = await tampilPesananById(pesanId);
    res.status(200).json({
      data:pesanan
    });
  }catch(error){
    res.status(400).json({
      message:error.message
    })
  }
})
router.patch("/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      throw new Error("Status wajib diisi.");
    }

    const updatedPesanan = await ubahStatusPesanan(id, status);

    res.status(200).json({
      message: "Status pesanan berhasil diperbarui",
      data: updatedPesanan
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
