import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  // Récupérer la recette par son ID
  useEffect(() => {
    fetch(`http://localhost:5454/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch((err) => console.error(err));
  }, [id]);

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
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover mb-4"
              />
              <p className="text-gray-700 mb-4">{recipe.ingredients}</p>
              <p className="text-gray-700 mb-4">{recipe.instructions}</p>
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
