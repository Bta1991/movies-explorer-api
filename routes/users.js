const express = require('express');

const router = express.Router();
const userController = require('../controllers/users'); //  путь к контроллеру пользователей
const { validateUpdateUser } = require('../middlewares/validation-joi');

// GET /me - возвращает информацию о текущем пользователе
router.get('/me', userController.getCurrentUser);

// PATCH /me — обновляет профиль
router.patch('/me', validateUpdateUser, userController.updateUserProfile);

module.exports = router;
