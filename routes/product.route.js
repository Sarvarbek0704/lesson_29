const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().optional(),
  price: Joi.number().required(),
  count: Joi.number().required(),
  category: Joi.string().required(),
});

router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = new Product(req.body);
  await product.save();
  res.send(product);
});

router.get("/", async (req, res) => {
  const { category, minPrice, maxPrice, page = 1, limit = 5 } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("category");

  res.send(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) return res.status(404).send("Not found");
  res.send(product);
});

router.patch("/:id", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).send("Not found");
  res.send(product);
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).send("Not found");
  res.send(product);
});

module.exports = router;
