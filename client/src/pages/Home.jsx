import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5454/api/recipes/all?page=${currentPage}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(err));
  }, [currentPage]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Toutes les Recettes
        </h1>
        {/* Bouton Ajouter une recette (visible seulement si l'utilisateur est connecté) */}
        {user && (
          <Link to="/add-recipe">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
              + Ajouter une recette
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white shadow-md rounded-lg p-4">
            {/* Ajout de l'image */}
            <img
              src={`http://localhost:5454${recipe.image}`} // Vérifie bien que ton serveur sert les images correctement
              alt={recipe.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h2 className="text-xl font-semibold text-gray-700">
              {recipe.title}
            </h2>
            <p className="text-gray-500">
              {recipe.ingredients.slice(0, 50)}...
            </p>
            <Link
              to={`/recipe/${recipe._id}`}
              className="text-blue-500 hover:underline"
            >
              Voir la recette
            </Link>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          ◀️
        </button>
        <span className="text-gray-800 font-semibold">
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          ▶️
        </button>
      </div>
    </div>
  );
}

export default Home;
