const Card = require('../models/movie'); // путь к модели карточки

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

// Обработчик для получения всех карточек
exports.getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    return res.json(cards);
  } catch (err) {
    return next(new Error('Произошла ошибка при получении карточек'));
  }
};

// Обработчик для создания новой карточки
exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const newCard = await Card.create({ name, link, owner });
    return res.status(201).json(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные карточки'));
    }
    return next(new Error('Произошла ошибка при создании карточки'));
  }
};

// Обработчик для удаления карточки по ID
exports.deleteCardById = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    // Находим карточку по ID
    const cardToDelete = await Card.findById(cardId);

    if (!cardToDelete) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    // Проверяем, является ли текущий пользователь владельцем карточки
    if (cardToDelete.owner.toString() !== userId) {
      return next(
        new ForbiddenError('У вас нет прав на удаление этой карточки'),
      );
    }

    const result = await cardToDelete.deleteOne();
    if (result.deletedCount === 0) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.json({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID карточки'));
    }
    return next(new Error('Произошла ошибка при удалении карточки'));
  }
};

// Обработчик для лайка карточки по ID
exports.likeCard = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!updatedCard) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.json(updatedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID карточки'));
    }
    return next(new Error('Произошла ошибка при постановке лайка'));
  }
};

// Обработчик для удаления лайка карточки по ID
exports.dislikeCard = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!updatedCard) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.json(updatedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID карточки'));
    }
    return next(new Error('Произошла ошибка при снятии лайка'));
  }
};
