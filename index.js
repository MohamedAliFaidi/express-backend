const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const verify = require("./verify");
const compression = require("compression");
const {
  newProduct,
  getProduct,
  getProducts,
} = require("./controllers/productController");

const app = express();

const port = 4000;
const dbConnect = require("./config/db");

dotenv.config();

app.use(compression());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(helmet());
app.disable("x-powered-by");

app.use(express.json());

dbConnect();

app.get("/", verify, (req, res) => {
  console.log(req)
  return res.json({
    rahtech: "Welcome to Rahtech api",
  });
});

app.get("/api/products", verify, getProducts);

app.post("/api/products/create", newProduct);

app.get("/api/products/getproduct/:id", getProduct);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
