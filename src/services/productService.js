const Product = require('../models/Product');

exports.getAll = async () => {
  return Product.find().lean();
};

exports.getById = async (id) => {
  return Product.findById(id).lean();
};

exports.create = async (data) => {
  return Product.create(data);
};

exports.update = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return Product.findByIdAndDelete(id);
};
