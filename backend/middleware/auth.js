const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: {
        message: 'Token de acesso não fornecido',
        status: 401
      }
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: {
          message: 'Token inválido ou expirado',
          status: 403
        }
      });
    }

    req.user = user;
    next();
  });
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      error: {
        message: 'Acesso negado. Privilégios de administrador necessários.',
        status: 403
      }
    });
  }
};

// Gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role || 'user'
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN
    }
  );
};

// Verificar se token é válido (sem middleware)
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  verifyToken
}; 