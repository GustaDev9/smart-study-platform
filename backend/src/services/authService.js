const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async register({ name, email, password }) {
    // Validações
    if (!name || !email || !password) {
      throw new Error('Todos os campos são obrigatórios');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    // Verifica se já existe
    const exists = await userRepository.emailExists(email);
    if (exists) {
      throw new Error('Este email já está em uso');
    }

    // Hash da senha
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, rounds);

    // Cria usuário
    const user = await userRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Gera token
    const token = this._generateToken(user.id);

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Credenciais inválidas');
    }

    const token = this._generateToken(user.id);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }

  _generateToken(userId) {
    return jwt.sign({ id: userId }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }
}

module.exports = new AuthService();
