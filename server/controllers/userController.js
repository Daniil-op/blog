const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const { User } = require('../models/models');

const generateJwt = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};

class UserController {
  async registration(req, res, next) {
    try {
      const { email, username, password, role } = req.body;
      console.log('Registration request data:', { email, username, password, role });

      if (!email || !password) {
        return next(ApiError.badRequest('Некорректный email или password'));
      }

      // Проверка роли
      if (role && !['USER', 'AUTHOR'].includes(role.toUpperCase())) {
        return next(ApiError.badRequest('Некорректная роль. Допустимые значения: USER, AUTHOR'));
      }

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует'));
      }

      const hashPassword = await bcrypt.hash(password, 5);
      console.log('Password hashed successfully');

      const user = await User.create({
        email,
        username,
        role: role.toUpperCase() || 'USER', // Сохраняем роль в верхнем регистре
        password: hashPassword,
      });
      console.log('User created successfully:', user);

      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (error) {
      console.error('Error during registration:', error);
      next(ApiError.internal('Ошибка при регистрации'));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.internal('Пользователь не найден'));
      }

      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.internal('Указан неверный пароль'));
      }

      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      next(ApiError.internal('Ошибка при входе'));
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(req.user.id, req.user.email, req.user.role);
      return res.json({ token });
    } catch (error) {
      console.error('Error during token check:', error);
      next(ApiError.internal('Ошибка при проверке токена'));
    }
  }

  async get(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ where: { id: decoded.id } });

      if (!user) {
        return next(ApiError.internal('Пользователь не найден'));
      }

      return res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      console.error('Error getting user:', error);
      next(ApiError.internal('Ошибка при получении данных пользователя'));
    }
  }

  async create(req, res, next) {
    try {
      const { email, username, password, role } = req.body;

      if (!email || !password) {
        return next(ApiError.badRequest('Некорректный email или password'));
      }

      if (role && !['USER', 'AUTHOR'].includes(role)) {
        return next(ApiError.badRequest('Некорректная роль. Допустимые значения: USER, AUTHOR'));
      }

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует'));
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({
        email,
        username,
        role: role || 'USER', // Если роль не указана, по умолчанию 'USER'
        password: hashPassword
      });

      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (error) {
      console.error('Error creating user:', error);
      next(ApiError.internal('Ошибка при создании пользователя'));
    }
  }
}

module.exports = new UserController();