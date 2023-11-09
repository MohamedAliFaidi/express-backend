const Product = require('../models/product');
const APIFilters = require('../utils/APIFilter');

const newProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
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
    return res.status(404).json({
      error: 'Product not found.',
    });
  }
  return res.status(200).json({
    product,
  });
};

const getProducts = async (req, res) => {
  try {
    const resPerPage = parseInt(req.headers.resperpage) || 5;
    const productsCount = await Product.countDocuments();

    const apiFilters = new APIFilters(Product.find(), req.query)
      .search()
      .filter();
    let products = await apiFilters.query;
    const filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);

    products = await apiFilters.query.clone();

    return res.status(200).json({
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
