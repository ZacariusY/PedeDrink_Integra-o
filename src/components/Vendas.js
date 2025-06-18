import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Plus, ShoppingCart, Calendar, User, Package, ArrowLeft, Save } from 'lucide-react';

const Vendas = () => {
  const { products, sales, addSale } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    customer: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [filterDate, setFilterDate] = useState('');

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: '',
      customer: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === parseInt(formData.productId));
    if (!product) {
      alert('Produto não encontrado');
      return;
    }

    if (product.quantity < parseInt(formData.quantity)) {
      alert('Quantidade insuficiente em estoque');
      return;
    }

    const saleData = {
      productId: parseInt(formData.productId),
      productName: product.name,
      quantity: parseInt(formData.quantity),
      unitPrice: product.price,
      totalPrice: product.price * parseInt(formData.quantity),
      customer: formData.customer,
      date: new Date(formData.date)
    };

    addSale(saleData);
    closeForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrar vendas por data se filtro estiver ativo
  const filteredSales = filterDate 
    ? sales.filter(sale => {
        const saleDate = new Date(sale.date).toISOString().split('T')[0];
        return saleDate === filterDate;
      })
    : sales;

  // Ordenar vendas por data (mais recentes primeiro)
  const sortedSales = [...filteredSales].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calcular totais
  const totalVendas = filteredSales.length;
  const totalReceita = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalItens = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);

  // Se o formulário estiver aberto, mostra apenas o formulário
  if (showForm) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={closeForm}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.target.style.background = 'none'}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
            <h1 className="card-title" style={{ margin: 0 }}>
              Registrar Nova Venda
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
            <div className="form-group">
              <label className="form-label">Produto *</label>
              <select
                name="productId"
                className="form-control"
                value={formData.productId}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um produto</option>
                {products
                  .filter(product => product.quantity > 0)
                  .map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - R$ {product.price.toFixed(2)} 
                      (Estoque: {product.quantity})
                    </option>
                  ))
                }
              </select>
            </div>

            {formData.productId && (
              <div style={{ 
                padding: '1.5rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: '1px solid #e2e8f0'
              }}>
                {(() => {
                  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
                  return selectedProduct ? (
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontWeight: '600' }}>
                        {selectedProduct.name}
                      </h4>
                      <p style={{ margin: '0.25rem 0', color: '#64748b' }}>
                        Preço unitário: R$ {selectedProduct.price.toFixed(2)}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: '#64748b' }}>
                        Estoque disponível: {selectedProduct.quantity} unidades
                      </p>
                      {formData.quantity && (
                        <p style={{ 
                          fontWeight: '600', 
                          color: '#059669',
                          margin: '0.75rem 0 0 0',
                          fontSize: '1.1rem'
                        }}>
                          Total: R$ {(selectedProduct.price * parseInt(formData.quantity || 0)).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Quantidade *</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max={formData.productId ? 
                    products.find(p => p.id === parseInt(formData.productId))?.quantity || 0 
                    : 0
                  }
                  required
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data da Venda *</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nome do Cliente *</label>
              <input
                type="text"
                name="customer"
                className="form-control"
                value={formData.customer}
                onChange={handleInputChange}
                required
                placeholder="Digite o nome do cliente"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                type="button" 
                onClick={closeForm}
                style={{
                  background: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                style={{
                  background: '#1e293b',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Save size={18} />
                Registrar Venda
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="card-title">Fluxo de Vendas</h1>
        <button 
          onClick={openForm}
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
          <Plus size={20} />
          Nova Venda
        </button>
      </div>

      {/* Cards de Estatísticas de Vendas */}
      <div className="stats-grid">
        <div className="stat-card">
          <ShoppingCart size={32} />
          <div className="stat-number">{totalVendas}</div>
          <div className="stat-label">Total de Vendas{filterDate && ' (Filtrado)'}</div>
        </div>

        <div className="stat-card">
          <Package size={32} />
          <div className="stat-number">{totalItens}</div>
          <div className="stat-label">Itens Vendidos{filterDate && ' (Filtrado)'}</div>
        </div>

        <div className="stat-card">
          <Calendar size={32} />
          <div className="stat-number">R$ {totalReceita.toFixed(2)}</div>
          <div className="stat-label">Receita Total{filterDate && ' (Filtrado)'}</div>
        </div>

        <div className="stat-card">
          <User size={32} />
          <div className="stat-number">
            {new Set(filteredSales.map(sale => sale.customer)).size}
          </div>
          <div className="stat-label">Clientes Únicos{filterDate && ' (Filtrado)'}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Filtros</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Filtrar por Data:</label>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
          </div>
          {filterDate && (
            <button 
              onClick={() => setFilterDate('')}
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
              Limpar Filtro
            </button>
          )}
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Histórico de Vendas 
            {filterDate && ` - ${new Date(filterDate).toLocaleDateString('pt-BR')}`}
          </h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th>Cliente</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedSales.map(sale => (
                <tr key={sale.id}>
                  <td>{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{sale.productName}</div>
                  </td>
                  <td style={{ color: '#64748b' }}>{sale.customer}</td>
                  <td style={{ color: '#64748b' }}>{sale.quantity} unidades</td>
                  <td style={{ fontWeight: '600', color: '#1e293b' }}>R$ {sale.unitPrice.toFixed(2)}</td>
                  <td>
                    <span style={{ fontWeight: '600', color: '#059669' }}>
                      R$ {sale.totalPrice.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedSales.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem', 
              color: '#64748b',
              background: '#f8fafc',
              borderRadius: '12px',
              margin: '1rem'
            }}>
              <ShoppingCart size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
                {filterDate 
                  ? 'Nenhuma venda encontrada para a data selecionada'
                  : 'Nenhuma venda registrada'
                }
              </h3>
              <p style={{ margin: 0 }}>
                {filterDate 
                  ? 'Tente selecionar uma data diferente ou limpe o filtro.'
                  : 'Clique em "Nova Venda" para registrar sua primeira venda.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vendas; 