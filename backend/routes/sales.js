const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Base de dados em memória para vendas
let sales = [];

// GET /api/sales - Listar vendas
router.get('/', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Vendas listadas com sucesso',
      data: {
        sales,
        total: sales.length
      }
    });
  } catch (error) {
    console.error('Erro ao listar vendas:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

// POST /api/sales - Registrar nova venda
router.post('/', [
  body('productId').notEmpty().withMessage('ID do produto é obrigatório'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro positivo'),
  body('customerName').optional().isString().withMessage('Nome do cliente deve ser string')
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

    const { productId, quantity, customerName } = req.body;

    // Buscar produto
    const product = Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Produto não encontrado',
          status: 404
        }
      });
    }

    // Verificar estoque
    if (product.quantity < quantity) {
      return res.status(400).json({
        error: {
          message: 'Estoque insuficiente',
          status: 400
        }
      });
    }

    // Atualizar estoque
    Product.updateStock(productId, -quantity);

    // Criar venda
    const sale = {
      id: uuidv4(),
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      customerName: customerName || 'Cliente Anônimo',
      date: new Date(),
      userId: req.user.id
    };

    sales.push(sale);

    res.status(201).json({
      success: true,
      message: 'Venda registrada com sucesso',
      data: {
        sale
      }
    });

  } catch (error) {
    console.error('Erro ao registrar venda:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

module.exports = router; 