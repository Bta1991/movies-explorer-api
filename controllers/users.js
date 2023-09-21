const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET = 'dev-secret' } = process.env;
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

exports.getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Такого пользователя нет'));
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID пользователя'));
    }
    return next(
      new Error(
        'Произошла ошибка при получении информации о текущем пользователе',
      ),
    );
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  if (!name && !email) {
    return next(
      new BadRequestError('Не указаны данные для обновления профиля'),
    );
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный ID пользователя'));
    }
    if (err.code === 11000) {
      return next(
        new ConflictError('Пользователь с таким email уже существует'),
      );
    }
    return next(
      new Error('Произошла ошибка при обновлении профиля пользователя'),
    );
  }
};

exports.createUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    newUser.password = undefined;
    return res.status(201).json(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError('Переданы некорректные данные пользователя'),
      );
    }
    if (err.code === 11000) {
      return next(
        new ConflictError('Пользователь с таким email уже существует'),
      );
    }
    return next(new Error('Произошла ошибка при создании пользователя'));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1w' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 3600000 * 24 * 7,
    });
    return res.send({ message: 'Авторизация успешна' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError('Переданы некорректные данные пользователя'),
      );
    }
    return next(new Error('Произошла ошибка при попытке входа'));
  }
};

exports.logout = async (req, res, next) => {
  try {
    await res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.send({ message: 'Вы покинули сайт' });
  } catch (err) {
    return next(new Error('Ошибка выхода'));
  }
};
