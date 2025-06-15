import React from 'react';
import { useProducts } from '../context/ProductContext';
import { Package, DollarSign, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
  const {
    products,
    sales,
    getTotalProducts,
    getTotalRevenue,
    getTotalSales,
    getTopSellingProducts
  } = useProducts();

  const topProducts = getTopSellingProducts(5);
  const totalRevenue = getTotalRevenue();
  const totalProducts = getTotalProducts();
  const totalSales = getTotalSales();
  
  // Calcular categorias ativas
  const activeCategories = [...new Set(products.map(product => product.category))].length;

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
          <Package size={32} />
          <div className="stat-number">{activeCategories}</div>
          <div className="stat-label">Categorias Ativas</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Produtos Mais Vendidos */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top 5 Produtos Mais Vendidos</h2>
          </div>
          <div className="top-products">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.productId} className={`product-rank rank-${index + 1}`}>
                  <div className="rank-info">
                    <div className="rank-number">
                      {index + 1}
                    </div>
                    <div className="product-details">
                      <h4>{product.productName}</h4>
                      <p>{product.quantity} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="revenue-info">
                    <div className="revenue-amount">
                      R$ {product.revenue.toFixed(2)}
                    </div>
                    <div className="revenue-label">
                      Faturamento
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

        {/* Controle de Produtos por Categoria */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Produtos por Categoria</h2>
          </div>
          <div className="products-by-category">
            {(() => {
              const productsByCategory = {};
              products.forEach(product => {
                if (!productsByCategory[product.category]) {
                  productsByCategory[product.category] = [];
                }
                productsByCategory[product.category].push(product);
              });

              return Object.keys(productsByCategory).length > 0 ? (
                Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                  <div key={category} className="category-section">
                    <h4 className="category-title">
                      {category} ({categoryProducts.length} produtos)
                    </h4>
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="product-item">
                        <div className="product-info">
                          <h4>{product.name}</h4>
                          <p>R$ {product.price.toFixed(2)}</p>
                        </div>
                        <div className="product-quantity" style={{ 
                          color: product.quantity <= 5 ? '#dc3545' : '#28a745'
                        }}>
                          {product.quantity} unidades
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                  Nenhum produto cadastrado ainda
                </p>
              );
            })()}
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