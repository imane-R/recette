import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

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

  console.log(`http://localhost:5454${recipe?.image}`);
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
