import Product from '../models/Product.js';

export const getAll = async () => {
  return Product.find().lean();
};

export const getById = async (id) => {
  return Product.findById(id).lean();
};

export const create = async (data) => {
  return Product.create(data);
};

export const update = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id) => {
  return Product.findByIdAndDelete(id);
};
