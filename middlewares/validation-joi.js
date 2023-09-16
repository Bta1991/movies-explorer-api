const { celebrate, Joi } = require('celebrate');

// Регулярное выражение для проверки ссылок
// const linkValid = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./#?&]*)*$/;

// Схема валидации для регистрации пользователя
module.exports.signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

// Схема валидации для входа пользователя
module.exports.signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Схема валидации для идентификатора пользователя
module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

// Схема валидации для обновления информации о пользователе
module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// Схема валидации для создания фильма
module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    trailerLink: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    owner: Joi.string().required().length(24).hex(),
  }),
});

// Схема валидации для идентификатора СОХРАНЕННОГО фильма
module.exports.validateFilmId = celebrate({
  params: Joi.object().keys({
    filmId: Joi.string().required().length(24).hex(),
  }),
});
