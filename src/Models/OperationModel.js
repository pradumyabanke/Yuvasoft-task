const mongoose = require('mongoose');

const OperationSchema = new mongoose.Schema({

  title: { type: String, require: true },
  description: { type: String, require: true },
  user_id: { type: String, require: true },


}, { timestamps: true });

module.exports = mongoose.model('userOperation', OperationSchema);
