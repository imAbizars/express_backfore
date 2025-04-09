const prisma = require("../../src/db"); 
const bcrypt = require("bcrypt");

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash("admin54", 10);

  const admin = await prisma.user.create({
    data:{
      name : "",
      email:"admin54@gmail.com",
      password:hashedPassword,
      phonenumber : "",
      address:"",
      role:"ADMIN"
    }
  });

  console.log("Admin seeded:", admin);
}

seedAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
