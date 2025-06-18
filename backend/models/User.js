const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Base de dados em memória para usuários (temporário)
let users = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password" hasheado
    role: 'admin',
    email: 'admin@pededrink.com',
    createdAt: new Date('2024-01-01'),
    lastLogin: null
  }
];

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date();
    this.lastLogin = data.lastLogin || null;
  }

  // Validar dados do usuário
  static validate(userData) {
    const errors = [];

    if (!userData.username || userData.username.length < 3) {
      errors.push('Username deve ter pelo menos 3 caracteres');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!userData.email || !userData.email.includes('@')) {
      errors.push('Email deve ser válido');
    }

    return errors;
  }

  // Hash da senha
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  // Verificar senha
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Buscar usuário por username
  static findByUsername(username) {
    return users.find(user => user.username === username);
  }

  // Buscar usuário por email
  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  // Buscar usuário por ID
  static findById(id) {
    return users.find(user => user.id === id);
  }

  // Criar novo usuário
  static async create(userData) {
    const errors = this.validate(userData);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Verificar se username já existe
    if (this.findByUsername(userData.username)) {
      throw new Error('Username já existe');
    }

    // Verificar se email já existe
    if (this.findByEmail(userData.email)) {
      throw new Error('Email já existe');
    }

    // Hash da senha
    const hashedPassword = await this.hashPassword(userData.password);

    const newUser = new User({
      ...userData,
      password: hashedPassword
    });

    users.push(newUser);
    return newUser;
  }

  // Atualizar último login
  static updateLastLogin(userId) {
    const user = this.findById(userId);
    if (user) {
      user.lastLogin = new Date();
    }
    return user;
  }

  // Listar todos os usuários (sem senhas)
  static getAll() {
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));
  }

  // Deletar usuário
  static delete(userId) {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Atualizar usuário
  static update(userId, updateData) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Atualizar campos permitidos
    const allowedFields = ['email', 'role'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    return user;
  }
}

module.exports = User; 