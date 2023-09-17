const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
const { errors } = require('celebrate');

require('dotenv').config();

const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/routes');

const { PORT = 3000, MONGO_DB = 'mongodb://127.0.0.1:27017/filmsdb' } =
  process.env;

const app = express();

// лимитер для защиты от DDOS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Превышено количество запросов на сервер',
});

// включаем внешние мидлверы
app.use(limiter);
app.use(helmet());
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
