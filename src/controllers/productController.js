import * as productService from '../services/productService.js';

export const getAll = async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
};

export const getById = async (req, res) => {
  const product = await productService.getById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const create = async (req, res) => {
  const product = await productService.create(req.body);
  res.status(201).json(product);
};

export const update = async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  res.json(product);
};

export const remove = async (req, res) => {
  await productService.remove(req.params.id);
  res.status(204).send();
};
