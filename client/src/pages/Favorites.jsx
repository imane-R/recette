import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Favorites() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    console.log("👤 Utilisateur connecté :", user);
    if (!user) return;

    fetch(`http://localhost:5454/api/auth/user/${user._id}/favorites`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des favoris");
        return res.json();
      })
      .then((data) => {
        console.log("⭐ Recettes favorites reçues :", data);
        setFavorites(data);
      })
      .catch((err) => console.error("Erreur favoris :", err));
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        ⭐ Mes Recettes Favorites
      </h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={`http://localhost:5454${recipe.image}`}
                alt={recipe.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 truncate">
                  {recipe.title}
                </h2>
                <p className="text-gray-600 text-sm truncate">
                  {recipe.ingredients.slice(0, 50)}...
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/recipe/${recipe._id}`}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Voir la recette
                  </Link>
                  <span className="text-gray-500 text-sm">❤️</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center text-lg mt-6">
          Vous n'avez encore aucune recette en favori. 🍽️
        </p>
      )}
    </div>
  );
}

export default Favorites;
