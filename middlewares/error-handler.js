// здесь обрабатываем все ошибки и выключим правило для next у линтера
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // res.status(500).send({ message: 'На сервере произошла ошибка' });
  // const { statusCode = 500, message } = err;
  const statusCode = err.statusCode || 500;
  const message = err.message || 'На сервере произошла ошибка';

  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
