import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRadio, faTv, faFileAlt, faUser, faCog, faSignInAlt, faUserPlus, faEnvelope, faBookOpen, faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const NavItem = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => 
      `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-blue-900/50 text-white' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`
    }
  >
    <FontAwesomeIcon icon={icon} className="w-5 h-5 mr-3" />
    <span>{children}</span>
  </NavLink>
);

const Header = () => {
  const { currency, setCurrency } = useCurrency();
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = !!user;
  const isAdmin = user?.rol === 'admin';

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  // Cierra el menú al cambiar de ruta
  const location = useLocation();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const renderNavLinks = (isMobile = false) => (
    <div className={isMobile ? 'flex flex-col space-y-2 px-2 pt-2 pb-3' : 'hidden md:flex items-center space-x-1'}>
      <NavItem to="/" icon={faHome}>Inicio</NavItem>
      <NavItem to="/radio-online" icon={faRadio}>Radio Online</NavItem>
      <NavItem to="/tv-online" icon={faTv}>TV Online</NavItem>
      <NavItem to="/tutoriales" icon={faBookOpen}>Tutoriales</NavItem>
      <NavItem to="/desarrollo-personalizado" icon={faFileAlt}>Personalizado</NavItem>
      <NavItem to="/contact" icon={faEnvelope}>Contacto</NavItem>
      <NavItem to="/blog" icon={faBookOpen}>Blog</NavItem>
    </div>
  );

  return (
    <header className="bg-gray-900/80 backdrop-blur-lg text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src="/logo.png" alt="Hostreams Logo" className="h-10 w-auto" />
        </Link>
        
        <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-3">
          {renderNavLinks()}
        </div>

        <div className="hidden md:flex items-center space-x-3">
          {!loading && (
            <>
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

        {/* Botón del Menú Móvil */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-blue-200 hover:text-white focus:outline-none">
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Panel del Menú Móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-sm">
          {renderNavLinks(true)}
          <div className="border-t border-gray-700 px-2 pt-3 pb-3 space-y-2">
            {!loading && (
              <>
                {isLoggedIn ? (
                  <>
                    {isAdmin && <NavItem to="/admin" icon={faCog}>Admin</NavItem>}
                    <NavItem to="/my-account" icon={faUser}>Mi Cuenta</NavItem>
                    <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 text-blue-200 hover:bg-blue-800/50 hover:text-white">
                      <FontAwesomeIcon icon={faSignInAlt} className="w-5 h-5 mr-3 transform rotate-180" />
                      <span>Salir</span>
                    </button>
                  </>
                ) : (
                  <>
                    <NavItem to="/login" icon={faSignInAlt}>Login</NavItem>
                    <NavItem to="/register" icon={faUserPlus}>Registro</NavItem>
                  </>
                )}
              </>
            )}
            <div className="border-t border-gray-700 pt-4 mt-4 px-2">
              <label htmlFor="mobile-currency" className="sr-only">Seleccionar Moneda</label>
              <select
                id="mobile-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="CLP">CLP</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;