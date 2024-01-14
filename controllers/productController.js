const Product = require('../models/product');
const APIFilters = require('../utils/APIFilter');
const nodemailer = require('nodemailer');


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

const orderProduct = async (req,res)=>{
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "mouhammedalifaidi@gmail.com", // Your Gmail email address
      pass: "resr fbvr fiao goil" // Your Gmail password or App Password
    }})
    const mailOptions = {
      from: "Rahtech", // Sender address
      to: [req.body.email,process.env.MAILER],// List of recipients
      subject: 'Order review', // Subject line
      html: '<html><style>body {font-family: Arial, Helvetica, sans-serif;}.container {padding: 20px; background-color: #f1f1f1;}</style><body><h2>Rahtech E-shop</h2><div class="container"><h2>Order confrimation email</h2><p>Due to yur order our team will  phonecall as soon as possible </div></body></html>'
    };


     //Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      return res.status(500).send(`Error: ${error.message}`);
    }
    res.status(200).send(`Email sent: ${info.response}`);
  });

}

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

module.exports = { newProduct, getProducts, getProduct,orderProduct };
