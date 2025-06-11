import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Produtos from './components/Produtos';
import Vendas from './components/Vendas';
import Relatorios from './components/Relatorios';
import { ProductProvider } from './context/ProductContext';
import './App.css';

function App() {
  return (
    <ProductProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/relatorios" element={<Relatorios />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ProductProvider>
  );
}

export default App;
