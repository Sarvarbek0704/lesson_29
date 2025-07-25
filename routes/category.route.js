const express = require("express");
const router = express.Router();
const Category = require("../models/category.model");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().optional(),
});

router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category(req.body);
  await category.save();
  res.send(category);
});

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).send("Not found");
  res.send(category);
});

router.patch("/:id", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!category) return res.status(404).send("Not found");
  res.send(category);
});

router.delete("/:id", async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).send("Not found");
  res.send(category);
});

module.exports = router;
