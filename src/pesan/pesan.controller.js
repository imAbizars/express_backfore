const express = require("express");
const router = express.Router();
const { 
  buatPesanan,
  ambilPesanan
 } = require("./pesan.service");
//post
router.post("/", async (req, res) => {
  try {
    const pesanData = req.body;

    if (
      !pesanData.details ||
      !Array.isArray(pesanData.details) ||
      pesanData.details.length === 0
    ) {
      throw new Error("Detail pesanan wajib diisi.");
    }

    const buatPesan = await buatPesanan(pesanData);

    res.status(201).json({
      data: buatPesan,
      message: "Success",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//get
router.get("/",async(req,res)=>{
  try{
    const pesanan = await ambilPesanan();
    res.status(201).json(pesanan);
  }catch(error){
    res.status(400).json({
      message:error.message
    })
  }
})

module.exports = router;
