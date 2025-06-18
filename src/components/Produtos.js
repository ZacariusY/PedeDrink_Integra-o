import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Plus, Edit, Trash2, Save, ArrowLeft } from 'lucide-react';

const Produtos = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    image: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      quantity: '',
      category: '',
      image: ''
    });
    setSelectedImage(null);
    setEditingProduct(null);
  };

  const openForm = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        category: product.category,
        image: product.image
      });
      setSelectedImage(product.image);
      setEditingProduct(product);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedImage && !formData.image) {
      alert('Por favor, selecione uma foto para o produto!');
      return;
    }

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category,
      image: selectedImage || formData.image
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    closeForm();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

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
              {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Digite o nome do produto"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="Cerveja">Cerveja</option>
                <option value="Refrigerante">Refrigerante</option>
                <option value="Água">Água</option>
                <option value="Suco">Suco</option>
                <option value="Energético">Energético</option>
                <option value="Vinho">Vinho</option>
                <option value="Whisky">Whisky</option>
                <option value="Vodka">Vodka</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preço (R$)</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Imagem do Produto *</label>
              
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#64748b' }}>
                  Opção 1: Selecionar do computador
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#64748b' }}>
                  Opção 2: URL da imagem
                </label>
                <input
                  type="url"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            {(selectedImage || editingProduct?.image) && (
              <div className="image-preview">
                <div style={{ marginBottom: '0.75rem', fontWeight: '600', color: '#1e293b' }}>
                  Prévia da imagem:
                </div>
                <img 
                  src={selectedImage || editingProduct?.image} 
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

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
                {editingProduct ? 'Atualizar Produto' : 'Salvar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Lista de produtos
  return (
    <div className="main-content">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="card-title">Gerenciamento de Produtos</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => openForm()}
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
          Adicionar Produto
        </button>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Quantidade Anunciada</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.image || 'https://via.placeholder.com/80x80/1e293b/white?text=Produto'} 
                      alt={product.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x60/1e293b/white?text=Produto';
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{product.name}</div>
                  </td>
                  <td style={{ color: '#64748b' }}>{product.category}</td>
                  <td style={{ fontWeight: '600', color: '#1e293b' }}>R$ {product.price.toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      color: product.quantity <= 5 ? '#dc2626' : '#059669',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      {product.quantity} unidades
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => openForm(product)}
                        style={{
                          background: '#1e293b',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="Editar produto"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="Excluir produto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem', 
              color: '#64748b',
              background: '#f8fafc',
              borderRadius: '12px',
              margin: '1rem'
            }}>
              <Plus size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Nenhum produto cadastrado</h3>
              <p style={{ margin: 0 }}>Clique em "Adicionar Produto" para começar a gerenciar seu estoque.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Produtos; 