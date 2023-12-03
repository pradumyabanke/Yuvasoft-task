const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({

  username: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  token: { type: String, require: true },


}, { timestamps: true });

module.exports = mongoose.model('UserRegister', registerSchema);
