const express = require('express');
const prisma = require('../../db');
const bcrypt = require('bcrypt');
const router = express.Router();
const { loginUser } = require('./auth.service');

router.post("/register", async (req, res) => {
    try {
        //ambil field data user dari body
        const { name, email, password, phonenumber,address } = req.body;
        //jika smeua  field kosong 
        if (!name || !email || !password || !phonenumber|| !address) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        }

        // apakah email sudah digunakan 
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        //jika ada email di field 
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

       //create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phonenumber,
                address
            },
        });

        res.status(201).json({ message: "User berhasil dibuat", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    // Simpan ke session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phonenumber:user.phonenumber,
      address:user.address,
      role:user.role
    };

    res.json({ message: "Login berhasil", user: req.session.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ message: "Logout gagal" });
    }
    res.json({ message: "Logout berhasil" });
  });
});

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Belum login" });
  }
  res.json({ user: req.session.user });
});

module.exports = router;
