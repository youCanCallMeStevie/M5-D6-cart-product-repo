const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const router = express.Router();
const multer = require("multer");
const upload = multer({});
const {
  readDB,
  writeDB,
  getProducts,
  writeProducts,
} = require("../../lib/utilities");
const cartsPath = path.join(__dirname,"carts.json");

const { writeFile } = require("fs-extra");

// - You'll be in charge of creating the appropriate endpoint in the BE to store the items your "user" shops in the store. 

router.post("/:cartId/add-to-cart/:productId", async (req, res, next) => {
  try {
    let carts = await readDB(cartsPath)
    let updatedCart = carts.map(cart => cart._id === req.params.cartId ? {...cart, products:[...cart.products, req.params.productId]} : cart)
    await writeDB(cartsPath, updatedCart)
    res.send("ok")
  } catch (error) {
    console.log(error);
    next(error);
  }
});
  
// - You need to be able to retrieve those products in the Cart page, therefore creating the endpoint for it in the BE, and display them accordingly. 
router.get("/:cartId", async (req, res, next) => {
  try {
  let carts = await readDB(cartsPath)
  let cart  = carts.find(cart => cart._id === req.params.cartId)
  let products = await getProducts()
let filteredProducts = products.filter(product => cart.products.findIndex(product._id))
cart.products = filteredProducts
res.send(cart)
  } catch (error) {
    console.log(error);
    next(error);
    
  }
});


// - Add the functionality to remove items from the Cart.
router.route("/:cartId/remove-from-cart/:productId").delete(async (req, res, next) => {
  try {
    let carts = await readDB(cartsPath)
    let products = await getProducts()
    let updatedCart = carts.map(cart => cart._id === req.params.cartId ? products.filter(product => product._id != req.params.id) && await writeProducts(cartsPath, updatedCart) : cart)
    res.send("Product has been deleted")
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
