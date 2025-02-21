import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi"; // Icônes pour le menu mobile

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-50 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-black">
          🍴 RecettesDelices
        </Link>

        {/* Menu pour Desktop */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link
            to="/"
            className="text-black hover:text-gray-600 transition duration-300"
          >
            Accueil
          </Link>
          <Link
            to="/recettes"
            className="text-black hover:text-gray-600 transition duration-300"
          >
            Recettes
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-black hover:text-gray-600 transition duration-300"
              >
                Profil
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login"; // Redirection après logout
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-black hover:text-gray-600 transition duration-300"
            >
              Connexion
            </Link>
          )}
        </div>

        {/* Bouton Menu Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="lg:hidden flex flex-col items-center space-y-4 bg-white py-4 shadow-md">
          <Link
            to="/"
            className="text-black hover:text-gray-600 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Accueil
          </Link>
          <Link
            to="/"
            className="text-black hover:text-gray-600 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Recettes
          </Link>
          {user && (
            <Link
              to="/favorites"
              className="text-black hover:text-gray-600 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Recettes favorites
            </Link>
          )}
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-black hover:text-gray-600 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                Profil
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login"; // Redirection après logout
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-black hover:text-gray-600 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
