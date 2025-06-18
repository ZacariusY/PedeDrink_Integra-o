import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const Relatorios = () => {
  const { sales, products, getSalesByPeriod, getTopSellingProducts } = useProducts();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Cores para os gráficos
  const COLORS = ['#667eea', '#764ba2', '#48c6ef', '#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'];

  // Filtrar vendas por período se datas estiverem definidas
  const filteredSales = useMemo(() => {
    if (startDate && endDate) {
      return getSalesByPeriod(new Date(startDate), new Date(endDate));
    }
    return sales;
  }, [sales, startDate, endDate, getSalesByPeriod]);

  // Dados para gráfico de vendas por data
  const salesByDate = useMemo(() => {
    const salesData = {};
    filteredSales.forEach(sale => {
      const date = new Date(sale.date).toLocaleDateString('pt-BR');
      if (salesData[date]) {
        salesData[date].vendas += 1;
        salesData[date].receita += sale.totalPrice;
      } else {
        salesData[date] = {
          data: date,
          vendas: 1,
          receita: sale.totalPrice
        };
      }
    });
    return Object.values(salesData).sort((a, b) => new Date(a.data.split('/').reverse().join('-')) - new Date(b.data.split('/').reverse().join('-')));
  }, [filteredSales]);

  // Dados para gráfico de produtos mais vendidos
  const topProductsData = useMemo(() => {
    const productSales = {};
    filteredSales.forEach(sale => {
      if (productSales[sale.productName]) {
        productSales[sale.productName] += sale.quantity;
      } else {
        productSales[sale.productName] = sale.quantity;
      }
    });
    
    return Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [filteredSales]);

  // Dados para gráfico de vendas por categoria
  const salesByCategory = useMemo(() => {
    const categorySales = {};
    filteredSales.forEach(sale => {
      const product = products.find(p => p.id === sale.productId);
      if (product) {
        const category = product.category;
        if (categorySales[category]) {
          categorySales[category].value += sale.totalPrice;
          categorySales[category].quantity += sale.quantity;
        } else {
          categorySales[category] = {
            name: category,
            value: sale.totalPrice,
            quantity: sale.quantity
          };
        }
      }
    });
    return Object.values(categorySales);
  }, [filteredSales, products]);

  // Estatísticas do período
  const periodStats = useMemo(() => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const uniqueCustomers = new Set(filteredSales.map(sale => sale.customer)).size;
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      totalSales,
      totalRevenue,
      totalItems,
      uniqueCustomers,
      averageTicket
    };
  }, [filteredSales]);

  // Função para exportar relatório (simulada)
  const exportReport = () => {
    const reportData = {
      periodo: {
        inicio: startDate || 'Início dos registros',
        fim: endDate || 'Hoje'
      },
      estatisticas: periodStats,
      vendasPorData: salesByDate,
      produtosMaisVendidos: topProductsData,
      vendasPorCategoria: salesByCategory
    };

    // Simular download
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-pededrink-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="main-content">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="card-title">Relatórios de Vendas</h1>
        <button 
          onClick={exportReport}
          style={{ 
            background: '#1e293b',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <Download size={20} />
          Exportar Relatório
        </button>
      </div>

      {/* Filtros de Período */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Filtros de Período</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label className="form-label">Data Início:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Data Fim:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            {(startDate || endDate) && (
              <button 
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                style={{
                  background: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas do Período */}
      <div className="stats-grid">
        <div className="stat-card">
          <TrendingUp size={32} />
          <div className="stat-number">{periodStats.totalSales}</div>
          <div className="stat-label">Total de Vendas</div>
        </div>

        <div className="stat-card">
          <DollarSign size={32} />
          <div className="stat-number">R$ {periodStats.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Receita Total</div>
        </div>

        <div className="stat-card">
          <Calendar size={32} />
          <div className="stat-number">R$ {periodStats.averageTicket.toFixed(2)}</div>
          <div className="stat-label">Ticket Médio</div>
        </div>

        <div className="stat-card">
          <TrendingUp size={32} />
          <div className="stat-number">{periodStats.uniqueCustomers}</div>
          <div className="stat-label">Clientes Únicos</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-2">
        {/* Gráfico de Vendas por Data */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Vendas por Data</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'receita' ? `R$ ${value.toFixed(2)}` : value,
                  name === 'receita' ? 'Receita' : 'Vendas'
                ]}
              />
              <Legend />
              <Line type="monotone" dataKey="vendas" stroke="#667eea" name="Vendas" />
              <Line type="monotone" dataKey="receita" stroke="#764ba2" name="Receita (R$)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Vendas por Categoria */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Vendas por Categoria</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Produtos Mais Vendidos */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Top 10 Produtos Mais Vendidos</h2>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#667eea" name="Quantidade Vendida" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela Detalhada de Vendas por Categoria */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Detalhamento por Categoria</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Quantidade Vendida</th>
                <th>Receita Total</th>
                <th>Receita Média por Venda</th>
                <th>% do Total</th>
              </tr>
            </thead>
            <tbody>
              {salesByCategory
                .sort((a, b) => b.value - a.value)
                .map(category => {
                  const percentage = (category.value / periodStats.totalRevenue * 100);
                  const averagePerSale = category.value / category.quantity;
                  
                  return (
                    <tr key={category.name}>
                      <td style={{ fontWeight: '500' }}>{category.name}</td>
                      <td>{category.quantity} unidades</td>
                      <td>R$ {category.value.toFixed(2)}</td>
                      <td>R$ {averagePerSale.toFixed(2)}</td>
                      <td>{percentage.toFixed(1)}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        
        {salesByCategory.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            Nenhuma venda encontrada para o período selecionado
          </p>
        )}
      </div>
    </div>
  );
};

export default Relatorios; 