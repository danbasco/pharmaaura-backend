const productService = require('../services/productService');

exports.getAll = async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
};

exports.getById = async (req, res) => {
  const product = await productService.getById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.create = async (req, res) => {
  const product = await productService.create(req.body);
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  res.json(product);
};

exports.remove = async (req, res) => {
  await productService.remove(req.params.id);
  res.status(204).send();
};
