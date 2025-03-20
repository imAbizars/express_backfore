const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        //ambil field data user dari body
        const { name, email, password, phonenumber } = req.body;
        //jika smeua  field kosong 
        if (!name || !email || !password || !phonenumber) {
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
            },
        });

        res.status(201).json({ message: "User berhasil dibuat", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});

module.exports = router;
