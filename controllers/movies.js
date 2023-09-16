const Movie = require('../models/movie'); // путь к модели фильмов

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

// Обработчик для получения всех сохраненных фильмов
exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    return res.json(movies);
  } catch (err) {
    return next(new Error('Произошла ошибка при получении фильмов'));
  }
};

// Обработчик для добавления фильма в избранное
exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  try {
    const newMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    });
    return res.status(201).json(newMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные фильма'));
    }
    return next(new Error('Произошла ошибка при создании фильма'));
  }
};

// Обработчик для удаления фильма из избранного по ID
exports.deleteMovieById = async (req, res, next) => {
  const { filmId } = req.params;
  const userId = req.user._id;

  try {
    // Находим фильм по ID
    const movieToDelete = await Movie.findById(filmId);

    if (!movieToDelete) {
      return next(new NotFoundError('Фильм не найден'));
    }

    // Проверяем, является ли текущий пользователь владельцем фильма
    if (movieToDelete.owner.toString() !== userId) {
      return next(new ForbiddenError('У вас нет прав на удаление фильма'));
    }

    const result = await movieToDelete.deleteOne();
    if (result.deletedCount === 0) {
      return next(new NotFoundError('Фильм не найден'));
    }
    return res.json({ message: 'Фильм удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID фильма'));
    }
    return next(new Error('Произошла ошибка при удалении фильма'));
  }
};

// Обработчик для лайка фильма по ID
exports.likeMovie = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.filmId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!updatedMovie) {
      return next(new NotFoundError('Фильм не найден'));
    }
    return res.json(updatedMovie);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID фильма'));
    }
    return next(new Error('Произошла ошибка при постановке лайка'));
  }
};

// Обработчик для удаления лайка фильма по ID
exports.dislikeMovie = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.filmId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!updatedMovie) {
      return next(new NotFoundError('Фильм не найден'));
    }
    return res.json(updatedMovie);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID фильма'));
    }
    return next(new Error('Произошла ошибка при снятии лайка'));
  }
};
