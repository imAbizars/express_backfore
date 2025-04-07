const express = require("express");
const session = require('express-session');
const dotenv = require("dotenv");
const path = require("path");
const productController = require("./src/product/product.controller");
const pesanController = require("./src/pesan/pesan.controller");
const authController = require("./src/user/auth/auth.router");
dotenv.config();
const app = express();
const PORT = process.env.PORT ;

// parsing JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.send("test 123");
});
app.use(session({
    secret: "rahasia-super-aman",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 jam
    }
  }));

// router
app.use("/auth",authController);
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use("/products",productController);
app.use("/pesan",pesanController);

app.listen(PORT, () => {
    console.log("Server berjalan di port " + PORT);
});
