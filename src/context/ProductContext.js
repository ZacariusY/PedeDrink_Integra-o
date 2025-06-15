import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();



export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [sales, setSales] = useState(() => {
    const savedSales = localStorage.getItem('sales');
    return savedSales ? JSON.parse(savedSales) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
  };

  const addSale = (sale) => {
    setSales(prevSales => [...prevSales, sale]);
  };

  const getTotalProducts = () => products.length;

  const getTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.totalPrice, 0);
  };

  const getTotalSales = () => sales.length;

  const getLowStockProducts = () => {
    return products.filter(product => product.quantity <= 5);
  };

  const getTopSellingProducts = (limit = 3) => {
    const productSales = {};
    
    sales.forEach(sale => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = {
          productId: sale.productId,
          productName: sale.productName,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[sale.productId].quantity += sale.quantity;
      productSales[sale.productId].revenue += sale.totalPrice;
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        sales,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        getTotalProducts,
        getTotalRevenue,
        getTotalSales,
        getLowStockProducts,
        getTopSellingProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}; 