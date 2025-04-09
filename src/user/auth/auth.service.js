// src/routes/auth/auth.service.js
const prisma = require('../../db');
const bcrypt = require('bcrypt');

async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("Email tidak ditemukan");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Password salah");

  return user;
}

module.exports = { loginUser };
