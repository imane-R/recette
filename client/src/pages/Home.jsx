import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  console.log("tatatata ", user);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Récupérer toutes les recettes
    fetch("http://localhost:5454/api/recipes/all")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Toutes les Recettes
        </h1>

        <div>
          {/* affichage de tous les recettes */}

          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white shadow-md rounded-lg p-4">
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
        {/* {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700">{recipe.title}</h2>
            <p className="text-gray-500">{recipe.ingredients.slice(0, 50)}...</p>
            <Link to={`/recipe/${recipe._id}`} className="text-blue-500 hover:underline">
              Voir la recette
            </Link>
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default Home;
