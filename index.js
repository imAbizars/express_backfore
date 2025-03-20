const express = require("express");
const dotenv = require("dotenv");
const createUser = require("./src/user/createuser");

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

app.listen(PORT, () => {
    console.log("Server berjalan di port " + PORT);
});
