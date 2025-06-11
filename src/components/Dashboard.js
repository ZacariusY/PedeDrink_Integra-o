import React from 'react';
import { useProducts } from '../context/ProductContext';
import { Package, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const {
    products,
    sales,
    getTotalProducts,
    getTotalRevenue,
    getTotalSales,
    getLowStockProducts,
    getTopSellingProducts
  } = useProducts();

  const lowStockProducts = getLowStockProducts();
  const topProducts = getTopSellingProducts(3);
  const totalRevenue = getTotalRevenue();
  const totalProducts = getTotalProducts();
  const totalSales = getTotalSales();

  // Vendas dos últimos 7 dias
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const recentSales = sales.filter(sale => new Date(sale.date) >= last7Days);

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Home - PEDEDRINK</h1>
        <p>Bem-vindo ao sistema de gerenciamento da distribuidora</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <Package size={32} />
          <div className="stat-number">{totalProducts}</div>
          <div className="stat-label">Produtos Cadastrados</div>
        </div>

        <div className="stat-card">
          <ShoppingCart size={32} />
          <div className="stat-number">{totalSales}</div>
          <div className="stat-label">Total de Vendas</div>
        </div>

        <div className="stat-card">
          <DollarSign size={32} />
          <div className="stat-number">R$ {totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Faturamento Total</div>
        </div>

        <div className="stat-card">
          <AlertTriangle size={32} />
          <div className="stat-number">{lowStockProducts.length}</div>
          <div className="stat-label">Produtos em Falta</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Produtos Mais Vendidos */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Produtos Mais Vendidos</h2>
          </div>
          <div>
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.productId} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: index < topProducts.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{product.productName}</div>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                      {product.quantity} unidades vendidas
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#28a745' }}>
                      R$ {product.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                Nenhuma venda registrada ainda
              </p>
            )}
          </div>
        </div>

        {/* Produtos com Estoque Baixo */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Produtos com Estoque Baixo</h2>
          </div>
          <div>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product, index) => (
                <div key={product.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: index < lowStockProducts.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{product.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                      {product.category}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: product.quantity <= 5 ? '#dc3545' : '#ffc107'
                    }}>
                      {product.quantity} unidades
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                Todos os produtos têm estoque adequado
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Vendas Recentes */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Vendas dos Últimos 7 Dias</h2>
        </div>
        <div>
          {recentSales.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Produto</th>
                    <th>Cliente</th>
                    <th>Quantidade</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.slice(0, 10).map(sale => (
                    <tr key={sale.id}>
                      <td>{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                      <td>{sale.productName}</td>
                      <td>{sale.customer}</td>
                      <td>{sale.quantity}</td>
                      <td>R$ {sale.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
              Nenhuma venda nos últimos 7 dias
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 