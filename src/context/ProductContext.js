import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ProductContext = createContext();

// Estado inicial com dados mocados mais completos
const initialState = {
  products: [
    {
      id: 1,
      name: 'Cerveja Skol 350ml',
      price: 2.50,
      quantity: 150,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Cerveja+Skol',
      category: 'Cerveja'
    },
    {
      id: 2,
      name: 'Cerveja Brahma 350ml',
      price: 2.80,
      quantity: 120,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Cerveja+Brahma',
      category: 'Cerveja'
    },
    {
      id: 3,
      name: 'Cerveja Heineken 350ml',
      price: 4.50,
      quantity: 80,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Heineken',
      category: 'Cerveja'
    },
    {
      id: 4,
      name: 'Refrigerante Coca-Cola 2L',
      price: 6.00,
      quantity: 75,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Coca+Cola',
      category: 'Refrigerante'
    },
    {
      id: 5,
      name: 'Refrigerante Pepsi 2L',
      price: 5.50,
      quantity: 60,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Pepsi',
      category: 'Refrigerante'
    },
    {
      id: 6,
      name: 'Refrigerante Guaraná 2L',
      price: 5.00,
      quantity: 90,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Guaraná',
      category: 'Refrigerante'
    },
    {
      id: 7,
      name: 'Água Mineral Crystal 500ml',
      price: 1.50,
      quantity: 300,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Água+Crystal',
      category: 'Água'
    },
    {
      id: 8,
      name: 'Água Mineral São Lourenço 1.5L',
      price: 3.00,
      quantity: 150,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=São+Lourenço',
      category: 'Água'
    },
    {
      id: 9,
      name: 'Suco Del Valle Laranja 1L',
      price: 4.50,
      quantity: 45,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Del+Valle',
      category: 'Suco'
    },
    {
      id: 10,
      name: 'Suco Maguary Uva 1L',
      price: 4.00,
      quantity: 35,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Maguary',
      category: 'Suco'
    },
    {
      id: 11,
      name: 'Energético Red Bull 250ml',
      price: 8.00,
      quantity: 25,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Red+Bull',
      category: 'Energético'
    },
    {
      id: 12,
      name: 'Energético Monster 473ml',
      price: 10.00,
      quantity: 20,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Monster',
      category: 'Energético'
    },
    {
      id: 13,
      name: 'Vinho Tinto Suave 750ml',
      price: 15.00,
      quantity: 30,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Vinho+Tinto',
      category: 'Vinho'
    },
    {
      id: 14,
      name: 'Whisky Johnnie Walker Red 1L',
      price: 85.00,
      quantity: 8,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=J.Walker',
      category: 'Whisky'
    },
    {
      id: 15,
      name: 'Vodka Smirnoff 1L',
      price: 45.00,
      quantity: 12,
      inStock: true,
      image: 'https://via.placeholder.com/200x200/2196F3/white?text=Smirnoff',
      category: 'Vodka'
    }
  ],
  sales: [
    {
      id: 1,
      productId: 1,
      productName: 'Cerveja Skol 350ml',
      quantity: 12,
      unitPrice: 2.50,
      totalPrice: 30.00,
      date: new Date('2024-01-15'),
      customer: 'João Silva'
    },
    {
      id: 2,
      productId: 4,
      productName: 'Refrigerante Coca-Cola 2L',
      quantity: 3,
      unitPrice: 6.00,
      totalPrice: 18.00,
      date: new Date('2024-01-15'),
      customer: 'Maria Santos'
    },
    {
      id: 3,
      productId: 2,
      productName: 'Cerveja Brahma 350ml',
      quantity: 6,
      unitPrice: 2.80,
      totalPrice: 16.80,
      date: new Date('2024-01-16'),
      customer: 'Pedro Oliveira'
    },
    {
      id: 4,
      productId: 7,
      productName: 'Água Mineral Crystal 500ml',
      quantity: 24,
      unitPrice: 1.50,
      totalPrice: 36.00,
      date: new Date('2024-01-16'),
      customer: 'Ana Costa'
    },
    {
      id: 5,
      productId: 3,
      productName: 'Cerveja Heineken 350ml',
      quantity: 8,
      unitPrice: 4.50,
      totalPrice: 36.00,
      date: new Date('2024-01-17'),
      customer: 'Carlos Mendes'
    },
    {
      id: 6,
      productId: 11,
      productName: 'Energético Red Bull 250ml',
      quantity: 4,
      unitPrice: 8.00,
      totalPrice: 32.00,
      date: new Date('2024-01-17'),
      customer: 'Fernanda Lima'
    },
    {
      id: 7,
      productId: 9,
      productName: 'Suco Del Valle Laranja 1L',
      quantity: 2,
      unitPrice: 4.50,
      totalPrice: 9.00,
      date: new Date('2024-01-18'),
      customer: 'Rafael Souza'
    },
    {
      id: 8,
      productId: 5,
      productName: 'Refrigerante Pepsi 2L',
      quantity: 5,
      unitPrice: 5.50,
      totalPrice: 27.50,
      date: new Date('2024-01-18'),
      customer: 'Lucia Pereira'
    },
    {
      id: 9,
      productId: 1,
      productName: 'Cerveja Skol 350ml',
      quantity: 18,
      unitPrice: 2.50,
      totalPrice: 45.00,
      date: new Date('2024-01-19'),
      customer: 'Roberto Junior'
    },
    {
      id: 10,
      productId: 14,
      productName: 'Whisky Johnnie Walker Red 1L',
      quantity: 1,
      unitPrice: 85.00,
      totalPrice: 85.00,
      date: new Date('2024-01-19'),
      customer: 'Eduardo Alves'
    },
    {
      id: 11,
      productId: 6,
      productName: 'Refrigerante Guaraná 2L',
      quantity: 4,
      unitPrice: 5.00,
      totalPrice: 20.00,
      date: new Date('2024-01-20'),
      customer: 'Patrícia Rocha'
    },
    {
      id: 12,
      productId: 15,
      productName: 'Vodka Smirnoff 1L',
      quantity: 2,
      unitPrice: 45.00,
      totalPrice: 90.00,
      date: new Date('2024-01-20'),
      customer: 'Marcelo Dias'
    }
  ],
  nextProductId: 16,
  nextSaleId: 13
};

// Reducer para gerenciar ações
const productReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, { ...action.payload, id: state.nextProductId }],
        nextProductId: state.nextProductId + 1
      };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };

    case 'ADD_SALE':
      const product = state.products.find(p => p.id === action.payload.productId);
      const updatedProducts = state.products.map(p =>
        p.id === action.payload.productId
          ? { ...p, quantity: p.quantity - action.payload.quantity }
          : p
      );

      return {
        ...state,
        products: updatedProducts,
        sales: [...state.sales, { ...action.payload, id: state.nextSaleId }],
        nextSaleId: state.nextSaleId + 1
      };

    case 'LOAD_DATA':
      return action.payload;

    default:
      return state;
  }
};

// Provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedData = localStorage.getItem('pededrink-data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Converter strings de data de volta para objetos Date
      parsedData.sales = parsedData.sales.map(sale => ({
        ...sale,
        date: new Date(sale.date)
      }));
      dispatch({ type: 'LOAD_DATA', payload: parsedData });
    }
  }, []);

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('pededrink-data', JSON.stringify(state));
  }, [state]);

  // Actions
  const addProduct = (product) => {
    dispatch({ type: 'ADD_PRODUCT', payload: product });
  };

  const updateProduct = (product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
  };

  const deleteProduct = (productId) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
  };

  const addSale = (sale) => {
    dispatch({ type: 'ADD_SALE', payload: sale });
  };

  // Computed values
  const getProductById = (id) => {
    return state.products.find(product => product.id === id);
  };

  const getTotalProducts = () => {
    return state.products.length;
  };

  const getTotalRevenue = () => {
    return state.sales.reduce((total, sale) => total + sale.totalPrice, 0);
  };

  const getTotalSales = () => {
    return state.sales.length;
  };

  const getLowStockProducts = () => {
    return state.products.filter(product => product.quantity <= 10);
  };

  const getSalesByPeriod = (startDate, endDate) => {
    return state.sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });
  };

  const getTopSellingProducts = (limit = 5) => {
    const productSales = {};
    
    state.sales.forEach(sale => {
      if (productSales[sale.productId]) {
        productSales[sale.productId].quantity += sale.quantity;
        productSales[sale.productId].revenue += sale.totalPrice;
      } else {
        productSales[sale.productId] = {
          productId: sale.productId,
          productName: sale.productName,
          quantity: sale.quantity,
          revenue: sale.totalPrice
        };
      }
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  };

  const value = {
    // State
    products: state.products,
    sales: state.sales,
    
    // Actions
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    
    // Computed values
    getProductById,
    getTotalProducts,
    getTotalRevenue,
    getTotalSales,
    getLowStockProducts,
    getSalesByPeriod,
    getTopSellingProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook para usar o contexto
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
}; 