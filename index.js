const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const createUser = require("./src/user/createuser");
const productController = require("./src/product/product.controller");
dotenv.config();
const app = express();
const PORT = process.env.PORT ;

// parsing JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.send("test 123");
});

// router
app.use("/register", createUser);
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use("/products",productController);

app.listen(PORT, () => {
    console.log("Server berjalan di port " + PORT);
});
