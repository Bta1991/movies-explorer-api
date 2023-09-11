const express = require('express');

const router = express.Router();
const userController = require('../controllers/users'); //  путь к контроллеру пользователей
const {
  validateUserId,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validation-joi');

// GET /me - возвращает информацию о текущем пользователе
router.get('/me', userController.getCurrentUser);

// GET /:userId - возвращает пользователя по _id
router.get('/:userId', validateUserId, userController.getUserById);

// PATCH /me — обновляет профиль
router.patch('/me', validateUpdateUser, userController.updateUserProfile);

// PATCH /me/avatar — обновляет аватар
router.patch(
  '/me/avatar',
  validateUpdateAvatar,
  userController.updateUserAvatar,
);

// GET / — возвращает всех пользователей
router.get('/', userController.getAllUsers);

module.exports = router;
