import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Package, ShoppingCart, BarChart2, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>PedeDrink</h1>
      </div>
      <div className="navbar-menu">
        <Link to="/dashboard" className="nav-item">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/produtos" className="nav-item">
          <Package size={20} />
          <span>Produtos</span>
        </Link>
        <Link to="/vendas" className="nav-item">
          <ShoppingCart size={20} />
          <span>Vendas</span>
        </Link>
        <Link to="/relatorios" className="nav-item">
          <BarChart2 size={20} />
          <span>Relatórios</span>
        </Link>
      </div>
      <div className="navbar-end">
        <button onClick={handleLogout} className="nav-item logout">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 