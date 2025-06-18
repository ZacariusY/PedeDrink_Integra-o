const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken, authenticateToken, verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Login do usuário
router.post('/login', [
  body('email').isEmail().withMessage('Email deve ser válido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Dados inválidos',
          details: errors.array(),
          status: 400
        }
      });
    }

    const { email, password } = req.body;

    // Buscar usuário por email
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Credenciais inválidas',
          status: 401
        }
      });
    }

    // Verificar senha
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          message: 'Credenciais inválidas',
          status: 401
        }
      });
    }

    // Atualizar último login
    User.updateLastLogin(user.id);

    // Gerar token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// POST /api/auth/register - Registro de novo usuário
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username deve ter pelo menos 3 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('email').isEmail().withMessage('Email deve ser válido'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role deve ser user ou admin')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Dados inválidos',
          details: errors.array(),
          status: 400
        }
      });
    }

    const userData = req.body;

    // Criar usuário
    const newUser = await User.create(userData);

    // Gerar token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    
    if (error.message.includes('já existe') || error.message.includes('deve ter')) {
      return res.status(400).json({
        error: {
          message: error.message,
          status: 400
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// GET /api/auth/verify - Verificar token
router.get('/verify', authenticateToken, (req, res) => {
  try {
    const user = User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'Usuário não encontrado',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      message: 'Token válido',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const user = User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'Usuário não encontrado',
          status: 404
        }
      });
    }

    // Gerar novo token
    const newToken = generateToken(user);

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        token: newToken
      }
    });

  } catch (error) {
    console.error('Erro na renovação do token:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// GET /api/auth/profile - Perfil do usuário
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'Usuário não encontrado',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      message: 'Perfil do usuário',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

module.exports = router; 