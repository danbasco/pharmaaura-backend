import Product from '../models/Product.js';

export const getAll = async () => {
  return Product.find().lean();
};

export const getById = async (id) => {
  return await Product.findById(id).lean();
};

// Falta fazer lógica de validação
export const create = async (data) => {
  return await Product.create(data);
};

export const update = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id) => {
  return await Product.findByIdAndDelete(id);
};
