// Configurações do Backend PedeDrink
module.exports = {
  // Servidor
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT Secret para autenticação
  JWT_SECRET: process.env.JWT_SECRET || 'pededrink_super_secret_key_2024_muito_segura',
  JWT_EXPIRES_IN: '24h',
  
  // CORS - Origins permitidas
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Rate Limiting
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP
  },
  
  // Upload de arquivos
  UPLOAD: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    uploadPath: './uploads'
  },
  
  // Configurações de validação
  VALIDATION: {
    passwordMinLength: 6,
    usernameMinLength: 3,
    productNameMaxLength: 100,
    priceMax: 999999.99
  }
}; 