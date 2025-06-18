const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/reports/dashboard - Dados do dashboard
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    const productStats = Product.getStats();
    const lowStockProducts = Product.getLowStock();

    const dashboardData = {
      totalProducts: productStats.total,
      totalValue: productStats.totalValue,
      lowStockCount: lowStockProducts.length,
      averagePrice: productStats.averagePrice,
      categoryStats: productStats.categories,
      lowStockProducts: lowStockProducts.slice(0, 5), // Top 5 produtos com estoque baixo
      timestamp: new Date()
    };

    res.json({
      success: true,
      message: 'Dados do dashboard',
      data: dashboardData
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor',
        status: 500
      }
    });
  }
});

module.exports = router; 