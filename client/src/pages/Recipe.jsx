import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://localhost:5454/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération de la recette :", err)
      );
  }, [id]);

  // 📌 Récupérer l'utilisateur SEULEMENT si `recipe.author` est un ID et pas déjà un objet
  useEffect(() => {
    if (recipe && typeof recipe.author === "string") {
      fetch(`http://localhost:5454/api/auth/user/${recipe.author}`)
        .then((res) => res.json())
        .then((data) =>
          setRecipe((prevRecipe) => ({
            ...prevRecipe,
            author: data, // ✅ Remplace l'ID par l'objet utilisateur
          }))
        )
        .catch((err) =>
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            err
          )
        );
    }
  }, [recipe?.author]);

  const navigate = useNavigate();

  // 📌 Supprimer une recette
  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette recette ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5454/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        alert("Recette supprimée avec succès !");
        navigate("/"); // 🔄 Redirige vers la page d'accueil après suppression
      } else {
        alert("Erreur lors de la suppression de la recette.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur s'est produite.");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Recette
          </h2>
          {recipe ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {recipe.title}
              </h3>
              <img
                src={`http://localhost:5454${recipe?.image}`}
                alt={recipe.title}
                className="w-full h-64 object-cover mb-4"
              />
              <p className="text-gray-700 mb-4">{recipe.ingredients}</p>
              <p className="text-gray-700 mb-4">{recipe.instructions}</p>
              <p className="text-gray-700 mb-4">
                {recipe.author?.username || "Inconnu"} le{" "}
                {new Date(recipe.createdAT).toLocaleDateString()}
              </p>
              {/* 📌 Boutons Modifier et Supprimer (Seulement pour l'Auteur) */}
              {user && recipe.author?._id === user._id && (
                <div className="flex justify-between mt-4">
                  <Link to={`/edit-recipe/${id}`}>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300">
                      ✏️ Modifier
                    </button>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                  >
                    🗑 Supprimer
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-700">Chargement...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recipe;
