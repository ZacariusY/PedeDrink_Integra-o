import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, BarChart } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          PEDEDRINK
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className={isActive('/')}>
              <Home size={18} />
              Home
            </Link>
          </li>
          <li>
            <Link to="/produtos" className={isActive('/produtos')}>
              <Package size={18} />
              Produtos
            </Link>
          </li>
          <li>
            <Link to="/vendas" className={isActive('/vendas')}>
              <ShoppingCart size={18} />
              Vendas
            </Link>
          </li>
          <li>
            <Link to="/relatorios" className={isActive('/relatorios')}>
              <BarChart size={18} />
              Relatórios
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 