const { v4: uuidv4 } = require('uuid');

// Base de dados em memória para produtos
let products = [
  {
    id: '1',
    name: 'Cerveja Skol 350ml',
    price: 2.50,
    quantity: 150,
    category: 'Cerveja',
    image: null,
    description: 'Cerveja gelada tradicional',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Refrigerante Coca-Cola 2L',
    price: 6.00,
    quantity: 75,
    category: 'Refrigerante',
    image: null,
    description: 'Refrigerante de cola tradicional',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Água Mineral Crystal 500ml',
    price: 1.50,
    quantity: 300,
    category: 'Água',
    image: null,
    description: 'Água mineral natural',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

class Product {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.price = parseFloat(data.price);
    this.quantity = parseInt(data.quantity);
    this.category = data.category;
    this.image = data.image || null;
    this.description = data.description || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Categorias válidas
  static getValidCategories() {
    return [
      'Cerveja',
      'Refrigerante',
      'Água',
      'Suco',
      'Energético',
      'Vinho',
      'Whisky',
      'Vodka',
      'Outros'
    ];
  }

  // Validar dados do produto
  static validate(productData) {
    const errors = [];
    const validCategories = this.getValidCategories();

    if (!productData.name || productData.name.trim().length < 2) {
      errors.push('Nome do produto deve ter pelo menos 2 caracteres');
    }

    if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
      errors.push('Preço deve ser um número maior que zero');
    }

    if (!productData.quantity || isNaN(productData.quantity) || productData.quantity < 0) {
      errors.push('Quantidade deve ser um número maior ou igual a zero');
    }

    if (!productData.category || !validCategories.includes(productData.category)) {
      errors.push(`Categoria deve ser uma das opções: ${validCategories.join(', ')}`);
    }

    if (productData.name && productData.name.length > 100) {
      errors.push('Nome do produto não pode ter mais de 100 caracteres');
    }

    return errors;
  }

  // Buscar produto por ID
  static findById(id) {
    return products.find(product => product.id === id);
  }

  // Listar todos os produtos
  static getAll(filters = {}) {
    let filteredProducts = [...products];

    // Filtrar por categoria
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }

    // Filtrar por estoque baixo
    if (filters.lowStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.quantity <= 10);
    }

    // Filtrar por nome (busca)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    // Ordenar
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return a.price - b.price;
          case 'quantity':
            return a.quantity - b.quantity;
          case 'category':
            return a.category.localeCompare(b.category);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }

    return filteredProducts;
  }

  // Criar novo produto
  static create(productData) {
    const errors = this.validate(productData);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Verificar se produto já existe
    const existingProduct = products.find(p => 
      p.name.toLowerCase() === productData.name.toLowerCase()
    );
    
    if (existingProduct) {
      throw new Error('Produto com este nome já existe');
    }

    const newProduct = new Product(productData);
    products.push(newProduct);
    return newProduct;
  }

  // Atualizar produto
  static update(id, updateData) {
    const product = this.findById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    const errors = this.validate({ ...product, ...updateData });
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Atualizar campos
    const allowedFields = ['name', 'price', 'quantity', 'category', 'image', 'description'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'price') {
          product[field] = parseFloat(updateData[field]);
        } else if (field === 'quantity') {
          product[field] = parseInt(updateData[field]);
        } else {
          product[field] = updateData[field];
        }
      }
    });

    product.updatedAt = new Date();
    return product;
  }

  // Deletar produto
  static delete(id) {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];
      return deletedProduct;
    }
    return null;
  }

  // Atualizar estoque (para vendas)
  static updateStock(id, quantityChange) {
    const product = this.findById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    const newQuantity = product.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error('Estoque insuficiente');
    }

    product.quantity = newQuantity;
    product.updatedAt = new Date();
    return product;
  }

  // Produtos com estoque baixo
  static getLowStock(threshold = 10) {
    return products.filter(product => product.quantity <= threshold);
  }

  // Estatísticas dos produtos
  static getStats() {
    return {
      total: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      lowStock: this.getLowStock().length,
      categories: this.getCategoryStats(),
      averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length || 0
    };
  }

  // Estatísticas por categoria
  static getCategoryStats() {
    const stats = {};
    this.getValidCategories().forEach(category => {
      const categoryProducts = products.filter(p => p.category === category);
      stats[category] = {
        count: categoryProducts.length,
        totalValue: categoryProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
      };
    });
    return stats;
  }
}

module.exports = Product; 