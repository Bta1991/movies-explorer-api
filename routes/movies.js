const express = require('express');

const router = express.Router();
const movieController = require('../controllers/movies'); //  путь к контроллеру фильмов

const {
  validateCreateMovie,
  validateFilmId,
} = require('../middlewares/validation-joi');

// GET /movies — возвращает все сохранённые текущим пользователем фильмы
router.get('/', movieController.getAllMovies);

// POST /movies — сохраняет в избранном фильм с переданными в теле данными
router.post('/', validateCreateMovie, movieController.createMovie);

// DELETE /movies/:filmId — удаляет фильм по идентификатору id
router.delete('/:filmId', validateFilmId, movieController.deleteMovieById);

// PUT /movies/:filmId/likes — поставить лайк фильму
router.put('/:filmId/likes', validateFilmId, movieController.likeMovie);

// DELETE /movies/:filmId/likes — убрать лайк с фильма
router.delete('/:filmId/likes', validateFilmId, movieController.dislikeMovie);

module.exports = router;
