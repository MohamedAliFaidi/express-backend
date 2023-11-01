const Product = require("../models/product");
const APIFilters = require("../utils/APIFilter");
const newProduct = async (req, res) => {
  try {
    let product = await Product.create(req.body);
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({
      error: "Product not found.",
    });
  } else {
    return res.status(200).json({
      product,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const resPerPage = 2;
    const productsCount = await Product.countDocuments();

    let apiFilters = new APIFilters(Product.find(), req.query)
      .search()
      .filter();

    let products = await apiFilters.query;
    const filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);

    products = await apiFilters.query.clone();


    res.status(200).json({
      productsCount,
      resPerPage,
      filteredProductsCount,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { newProduct, getProducts, getProduct };
