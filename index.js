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
  orderProduct
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
  return res.json({
    rahtech: "Welcome to Rahtech api",
  });
});

app.get("/api/products", verify, getProducts);

app.post("/api/products/create", newProduct);

app.get("/api/products/getproduct/:id", getProduct);

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

app.post("/api/isemail/", async (req,res) => {

  
  // Example: Generate a random string of length 10
  const randomString = generateRandomString(10);
  console.log(req.body)
  const bcrypt= require('bcrypt')

  const Prom = require('./models/promise')
  const promise = await Prom.create({name:req.body.name,email:req.body.email ,
        code : randomString,

    password:req.body.password});

        await promise.save();
        console.log(promise);

        const nodemailer = require('nodemailer')


  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "mouhammedalifaidi@gmail.com", // Your Gmail email address
      pass:"znbp lrxb pnhc eote"// Your Gmail password or App Password
    }})
    const mailOptions = {
      from: "Rahtech", // Sender address
      to: req.body.email,// List of recipients
      subject: 'Email verification', // Subject line
      html: `
      <p>Hello there!</p>
      <p>Your verification code is: <strong>${randomString}</strong></p>
      <p>Click the button below to verify your email:</p>
      <a href="http://localhost:3000/register?code=${randomString}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Verify Email</a>
    `
    };


     //Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      return res.status(500).send(`Error: ${error.message}`);
    }
    console.log(info)
      res.status(200);
      
    });
    
     res.json({
      message: "Email sent"
    });
  


    



});


app.post('/api/ordermail',orderProduct )

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
