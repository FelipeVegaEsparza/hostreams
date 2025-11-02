import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faFileAlt, faUser, faEnvelope, faFileContract } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const socialLinks = [
    { icon: faInstagram, href: 'https://www.instagram.com/hostreams', name: 'Instagram' },
    { icon: faYoutube, href: 'https://www.youtube.com/@hostreams', name: 'YouTube' },
    { icon: faTiktok, href: 'https://www.tiktok.com/@hostreams', name: 'TikTok' },
  ];

  const footerLinks = [
    { to: '/plans', text: 'Planes', icon: faFileAlt },
    { to: '/my-account', text: 'Mi Cuenta', icon: faUser },
    { to: '/contact', text: 'Contacto', icon: faEnvelope },
    { to: '/terms', text: 'Términos de Servicio', icon: faFileContract },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto text-white">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="flex flex-col">
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="Hostreams Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Radiostreaming, sitios web, APP PWA y hosting SSD en una sola plataforma profesional y fácil de usar.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-3">
              {footerLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="flex items-center text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1">
                    <FontAwesomeIcon icon={link.icon} className="mr-3 w-4 h-4" />
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <a href="mailto:contacto@hostreams.com" className="flex items-center text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1">
              <FontAwesomeIcon icon={faEnvelope} className="mr-3 w-4 h-4" />
              <span>contacto@hostreams.com</span>
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.name}
                  className="text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 text-2xl"
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-gray-500 text-sm order-2 sm:order-1 mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} Hostreams. Todos los derechos reservados.
          </p>
          <div className="order-1 sm:order-2">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</Link>
            <span className="text-gray-500">|</span>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
