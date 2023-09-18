const jwt = require('jsonwebtoken'); // импортируем JSONwebtoken
const util = require('util'); // импортируем модуль util для использования promisify
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET = 'dev-secret' } = process.env;
const jwtVerify = util.promisify(jwt.verify); // преобразуем коллбэк-функцию в промис

module.exports = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new UnauthorizedError('Токен отсуствует')); // проверяем наличие токена и возвращаем ошибку, если его нет
  }

  try {
    const payload = await jwtVerify(token, JWT_SECRET); // асинхронно проверяем токен
    req.user = payload; // добавляем пейлоуд токена в объект запроса
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Токен невалиден.')); // обрабатываем ошибку, если токен не валиден
  }
};
