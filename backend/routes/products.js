const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - Listar produtos com filtros
router.get('/', [
  query('category').optional().isIn(Product.getValidCategories()).withMessage('Categoria inválida'),
  query('lowStock').optional().isBoolean().withMessage('lowStock deve ser boolean'),
  query('search').optional().isString().withMessage('search deve ser string'),
  query('sortBy').optional().isIn(['name', 'price', 'quantity', 'category', 'createdAt']).withMessage('sortBy inválido')
], authenticateToken, (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Parâmetros inválidos',
          details: errors.array(),
          status: 400
        }
      });
    }

    const filters = {
      category: req.query.category,
      lowStock: req.query.lowStock,
      search: req.query.search,
      sortBy: req.query.sortBy
    };

    const products = Product.getAll(filters);

    res.json({
      success: true,
      message: 'Produtos listados com sucesso',
      data: {
        products,
        total: products.length,
        filters: filters
      }
    });

  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// GET /api/products/low-stock - Produtos com estoque baixo
router.get('/low-stock', [
  query('threshold').optional().isInt({ min: 1, max: 100 }).withMessage('Threshold deve ser entre 1 e 100')
], authenticateToken, (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Parâmetros inválidos',
          details: errors.array(),
          status: 400
        }
      });
    }

    const threshold = parseInt(req.query.threshold) || 10;
    const lowStockProducts = Product.getLowStock(threshold);

    res.json({
      success: true,
      message: 'Produtos com estoque baixo',
      data: {
        products: lowStockProducts,
        threshold,
        total: lowStockProducts.length
      }
    });

  } catch (error) {
    console.error('Erro ao buscar produtos com estoque baixo:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// GET /api/products/categories - Listar categorias disponíveis
router.get('/categories', authenticateToken, (req, res) => {
  try {
    const categories = Product.getValidCategories();
    const categoryStats = Product.getCategoryStats();

    res.json({
      success: true,
      message: 'Categorias disponíveis',
      data: {
        categories,
        stats: categoryStats
      }
    });

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// GET /api/products/:id - Buscar produto por ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const product = Product.findById(id);

    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Produto não encontrado',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      message: 'Produto encontrado',
      data: {
        product
      }
    });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// POST /api/products - Criar novo produto
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('price').isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que zero'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantidade deve ser um número inteiro positivo'),
  body('category').isIn(Product.getValidCategories()).withMessage('Categoria inválida'),
  body('description').optional().isString().withMessage('Descrição deve ser string'),
  body('image').optional().isString().withMessage('URL da imagem deve ser string')
], authenticateToken, async (req, res) => {
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

    const productData = req.body;
    const newProduct = Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: {
        product: newProduct
      }
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    
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

// PUT /api/products/:id - Atualizar produto
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('price').optional().isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que zero'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantidade deve ser um número inteiro positivo'),
  body('category').optional().isIn(Product.getValidCategories()).withMessage('Categoria inválida'),
  body('description').optional().isString().withMessage('Descrição deve ser string'),
  body('image').optional().isString().withMessage('URL da imagem deve ser string')
], authenticateToken, async (req, res) => {
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

    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = Product.update(id, updateData);

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: {
        product: updatedProduct
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        error: {
          message: error.message,
          status: 404
        }
      });
    }

    if (error.message.includes('deve ter') || error.message.includes('inválido')) {
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

// DELETE /api/products/:id - Deletar produto
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = Product.delete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        error: {
          message: 'Produto não encontrado',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      message: 'Produto deletado com sucesso',
      data: {
        product: deletedProduct
      }
    });

  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// GET /api/products/stats/overview - Estatísticas dos produtos
router.get('/stats/overview', authenticateToken, (req, res) => {
  try {
    const stats = Product.getStats();

    res.json({
      success: true,
      message: 'Estatísticas dos produtos',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// PATCH /api/products/:id/stock - Atualizar estoque específico
router.patch('/:id/stock', [
  body('quantity').isInt().withMessage('Quantidade deve ser um número inteiro'),
  body('operation').isIn(['add', 'subtract', 'set']).withMessage('Operação deve ser add, subtract ou set')
], authenticateToken, (req, res) => {
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

    const { id } = req.params;
    const { quantity, operation } = req.body;

    let quantityChange;
    switch (operation) {
      case 'add':
        quantityChange = quantity;
        break;
      case 'subtract':
        quantityChange = -quantity;
        break;
      case 'set':
        const product = Product.findById(id);
        if (!product) {
          return res.status(404).json({
            error: {
              message: 'Produto não encontrado',
              status: 404
            }
          });
        }
        quantityChange = quantity - product.quantity;
        break;
    }

    const updatedProduct = Product.updateStock(id, quantityChange);

    res.json({
      success: true,
      message: 'Estoque atualizado com sucesso',
      data: {
        product: updatedProduct,
        operation,
        previousQuantity: updatedProduct.quantity - quantityChange,
        newQuantity: updatedProduct.quantity
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        error: {
          message: error.message,
          status: 404
        }
      });
    }

    if (error.message.includes('insuficiente')) {
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

module.exports = router; 