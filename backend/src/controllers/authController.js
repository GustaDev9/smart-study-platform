const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });

      return res.status(201).json({
        success: true,
        message: 'Conta criada com sucesso!',
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        data: result,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async me(req, res) {
    return res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  }
}

module.exports = new AuthController();
