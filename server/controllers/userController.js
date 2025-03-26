const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')
const ApiError = require('../error/ApiError')

class UserController {
  async registration(req, res, next) {
    const { email, username, password, role = 'USER' } = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или пароль'))
    }
    const candidate = await User.findOne({ where: { email } })
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({ email, username, password: hashPassword, role })
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    )
    return res.json({ token })
  }

  async login(req, res, next) {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return next(ApiError.internal('Пользователь не найден'))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль'))
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    )
    return res.json({ token })
  }

  async check(req, res, next) {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    )
    return res.json({ token })
  }

  async get(req, res) {
    const { id } = req.user
    const user = await User.findOne({ where: { id } })
    return res.json(user)
  }

  // Метод для добавления админа (выполнить один раз)
  async createAdmin() {
    const adminEmail = 'admin@mail.ru'
    const adminPassword = 'admin'

    const admin = await User.findOne({ where: { email: adminEmail } })
    if (!admin) {
      const hashPassword = await bcrypt.hash(adminPassword, 5)
      await User.create({
        email: adminEmail,
        username: 'Admin',
        password: hashPassword,
        role: 'ADMIN'
      })
      console.log('Admin user created successfully')
    }
  }
}

module.exports = new UserController()