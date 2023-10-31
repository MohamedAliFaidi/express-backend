const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const {  newProduct, getProduct,getProducts } = require("./controllers/productController");
const app = express();
const helmet = require("helmet");
const port = 4000;
const dbConnect = require("./config/db");
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(helmet());
app.disable("x-powered-by");

app.use(express.json());


dbConnect();

app.get("/api/products",getProducts);

app.post("/api/products/create", newProduct);

app.get("/api/products/getproduct/:id", getProduct);


app.listen(port, () => {
  console.log(`Web_Server listening at http://localhost:${port}`);
});
