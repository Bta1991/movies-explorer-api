const router = require('express').Router();

const {
  signUpValidation,
  signInValidation,
} = require('../middlewares/validation-joi'); // Импорт схемы валидации
const userRouter = require('./users');
const movieRouter = require('./movies');
const userController = require('../controllers/users'); // Путь к контроллеру пользователей
const authMiddleware = require('../middlewares/auth'); // Путь к auth.js

const NotFoundError = require('../errors/not-found-err');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Роуты авторизации и регистрации
router.post('/signin', signInValidation, userController.login);
router.post('/signup', signUpValidation, userController.createUser);

// Применяем мидлвэр проверки авторизации ко всем маршрутам, кроме /signin и /signup
router.use(authMiddleware);

// Роуты пользователей и понравившихся фильмов
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/logout', userController.logout);

// Обработка запросов, которые не соответствуют ни одному маршруту
router.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
