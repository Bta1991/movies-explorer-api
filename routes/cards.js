const express = require('express');

const router = express.Router();
const cardController = require('../controllers/cards'); //  путь к контроллеру карточек

const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/validation-joi');

// GET /cards — возвращает все карточки
router.get('/', cardController.getAllCards);

// POST /cards — создаёт карточку
router.post('/', validateCreateCard, cardController.createCard);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/:cardId', validateCardId, cardController.deleteCardById);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/:cardId/likes', validateCardId, cardController.likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/:cardId/likes', validateCardId, cardController.dislikeCard);

module.exports = router;
