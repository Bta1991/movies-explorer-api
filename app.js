const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
const { errors } = require('celebrate');

require('dotenv').config();

const rateLimit = require('./middlewares/rate-limit');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/routes');

const { PORT = 3000, MONGO_DB = 'mongodb://127.0.0.1:27017/bitfilmsdb' } =
  process.env;

const app = express();

// включаем внешние мидлверы
app.use(rateLimit); // лимитер для защиты от DDOS
app.use(helmet()); // helmet заголовки для безопасности
// cors отключено пока нет фронтенда
// app.use(cors({ origin: ['http://diplom.nomoredomainsrocks.ru', 'https://diplom.nomoredomainsrocks.ru', 'http://localhost:3000'], credentials: true }));
app.use(cookieParser());

// мидлверы для разбора JSON-тела запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаем логгер запросов
app.use(requestLogger);

// Основной роутинг
app.use(routes);

// подключаемся к серверу mongo
mongoose
  .connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Слушаем 3000 порт
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('Ошибка подключения к базе данных:', err.message);
  });

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler); // централлизированный обработчик ошибок
