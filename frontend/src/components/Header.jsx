import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRadio, faTv, faFileAlt, faUser, faCog, faSignInAlt, faUserPlus, faEnvelope, faBookOpen, faHome } from '@fortawesome/free-solid-svg-icons';

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-blue-900/50 text-white' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`
    }
  >
    <FontAwesomeIcon icon={icon} className="w-5 h-5 mr-2" />
    <span>{children}</span>
  </NavLink>
);

const Header = () => {
  const { currency, setCurrency } = useCurrency();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setIsAdmin(false);
        } else {
          setIsLoggedIn(true);
          setIsAdmin(decodedToken.user?.rol === 'admin');
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/'); // Redirect to homepage
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-lg text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Hostreams Logo" className="h-10 w-auto" />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2">
          <NavItem to="/" icon={faHome}>Inicio</NavItem>
          <NavItem to="/radio-online" icon={faRadio}>Radio Online</NavItem>
          <NavItem to="/tv-online" icon={faTv}>TV Online</NavItem>
          <NavItem to="/tutoriales" icon={faBookOpen}>Tutoriales</NavItem>
          <NavItem to="/desarrollo-personalizado" icon={faFileAlt}>Personalizado</NavItem> {/* Added NavItem */}
          <NavItem to="/contact" icon={faEnvelope}>Contacto</NavItem>
          <NavItem to="/blog" icon={faBookOpen}>Blog</NavItem>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              {isAdmin && <NavItem to="/admin" icon={faCog}>Admin</NavItem>}
              <NavItem to="/my-account" icon={faUser}>Mi Cuenta</NavItem>
              <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 text-blue-200 hover:bg-blue-800/50 hover:text-white">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login" icon={faSignInAlt}>Login</NavItem>
              <NavItem to="/register" icon={faUserPlus}>Registro</NavItem>
            </>
          )}
          
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 text-white py-2 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition duration-300"
          >
            <option value="CLP">CLP</option>
            <option value="USD">USD</option>
          </select>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {/* Add mobile menu logic here if needed */}
        </div>
      </div>
    </header>
  );
};

export default Header;
