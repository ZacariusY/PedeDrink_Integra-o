import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Plus, ShoppingCart, Calendar, User, Package } from 'lucide-react';

const Vendas = () => {
  const { products, sales, addSale } = useProducts();
  const [showModal, setShowModal] = useState(false);
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

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
    closeModal();
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

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Fluxo de Vendas</h1>
        <button className="btn btn-primary" onClick={openModal}>
          <Plus size={18} />
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
              className="btn btn-secondary"
              onClick={() => setFilterDate('')}
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
                    <div style={{ fontWeight: '500' }}>{sale.productName}</div>
                  </td>
                  <td>{sale.customer}</td>
                  <td>{sale.quantity} unidades</td>
                  <td>R$ {sale.unitPrice.toFixed(2)}</td>
                  <td>
                    <span style={{ fontWeight: '600', color: '#28a745' }}>
                      R$ {sale.totalPrice.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedSales.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
              {filterDate 
                ? 'Nenhuma venda encontrada para a data selecionada'
                : 'Nenhuma venda registrada. Clique em "Nova Venda" para começar.'
              }
            </p>
          )}
        </div>
      </div>

      {/* Modal de Nova Venda */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Nova Venda</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Produto</label>
                <select
                  name="productId"
                  className="form-control"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {products
                    .filter(product => product.inStock && product.quantity > 0)
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
                  padding: '1rem', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '5px',
                  marginBottom: '1rem'
                }}>
                  {(() => {
                    const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
                    return selectedProduct ? (
                      <div>
                        <h4>{selectedProduct.name}</h4>
                        <p>Preço: R$ {selectedProduct.price.toFixed(2)}</p>
                        <p>Estoque disponível: {selectedProduct.quantity} unidades</p>
                        {formData.quantity && (
                          <p style={{ fontWeight: '600', color: '#28a745' }}>
                            Total: R$ {(selectedProduct.price * parseInt(formData.quantity || 0)).toFixed(2)}
                          </p>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Quantidade</label>
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
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cliente</label>
                <input
                  type="text"
                  name="customer"
                  className="form-control"
                  value={formData.customer}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data da Venda</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  <ShoppingCart size={18} />
                  Registrar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendas; 