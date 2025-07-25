const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoute = require("./routes/category.route");
const productRoute = require("./routes/product.route");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://sarvarbek:07042007@cluster0.rz9aath.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB uladni"))
  .catch((err) => console.error(err));

app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);

app.listen(3000, () => console.log("3000 da ishlayapti"));
