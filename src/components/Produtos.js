import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

const Produtos = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    image: '',
    inStock: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      quantity: '',
      category: '',
      image: '',
      inStock: true
    });
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview('');
  };

  const openModal = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        category: product.category,
        image: product.image,
        inStock: product.inStock
      });
      setEditingProduct(product);
      setImagePreview(product.image || '');
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      inStock: parseInt(formData.quantity) > 0,
      image: imagePreview || formData.image
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
    } else {
      addProduct(productData);
    }

    closeModal();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: '' })); // Limpa a URL quando arquivo é selecionado
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Gerenciamento de Produtos</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} />
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
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.image || 'https://via.placeholder.com/80x80/667eea/white?text=Produto'} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80/667eea/white?text=Produto';
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{product.name}</div>
                  </td>
                  <td>{product.category}</td>
                  <td>R$ {product.price.toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      color: product.quantity <= 10 ? '#dc3545' : '#28a745',
                      fontWeight: '500'
                    }}>
                      {product.quantity} unidades
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: product.inStock ? '#d4edda' : '#f8d7da',
                      color: product.inStock ? '#155724' : '#721c24'
                    }}>
                      {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-warning"
                        onClick={() => openModal(product)}
                        style={{ padding: '0.5rem' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(product.id)}
                        style={{ padding: '0.5rem' }}
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
            <p style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
              Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.
            </p>
          )}
        </div>
      </div>

      {/* Modal de Produto */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Produto' : 'Adicionar Produto'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome do Produto</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
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
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Imagem do Produto</label>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>
                    Opção 1: Selecionar do computador
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ flex: 1 }}
                    />
                    {imageFile && (
                      <button 
                        type="button" 
                        onClick={removeImage}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>
                    Opção 2: URL da imagem
                  </label>
                  <input
                    type="url"
                    name="image"
                    className="form-control"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                    disabled={!!imageFile}
                  />
                  {imageFile && (
                    <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                      Campo desabilitado pois uma imagem do computador foi selecionada
                    </small>
                  )}
                </div>
              </div>

              {(imagePreview || formData.image) && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Preview da imagem:</strong>
                  </div>
                  <img 
                    src={imagePreview || formData.image} 
                    alt="Preview"
                    className="product-image-large"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {!imageFile && formData.image && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Remover URL
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                  />
                  Produto em estoque
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  <Save size={18} />
                  {editingProduct ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos; 