const prisma = require('../../db');
const bcrypt = require('bcrypt');

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) throw new Error("Email tidak ditemukan");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Password salah");

  return user;
};

module.exports = {
  loginUser
};
