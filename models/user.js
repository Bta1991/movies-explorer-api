const mongoose = require('mongoose');
const validator = require('validator');
// Регулярное выражение для проверки ссылок
// const linkValid = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./#?&]*)*$/;

const userSchema = new mongoose.Schema(
  {
    // уникальный email
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Неверная почта'],
    },
    // хеш пароля
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      // имя
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
