import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AddRecipe() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("instructions", instructions);
    formData.append("image", image);
    formData.append("author", user._id); // Assurez-vous que `user` contient bien `_id`
    formData.append("createdAt", new Date().toISOString()); // Corriger "createdAT" -> "createdAt"
  
    console.log("test test ");
  
    try {
      const response = await fetch("http://localhost:5454/api/recipes/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData, // Pas de Content-Type ici, FormData le gère automatiquement
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la recette.");
      }
  
      alert("Recette ajoutée avec succès !");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Ajouter une Recette
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Titre</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nom de la recette"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: "1rem" }}
          >
            <label className="block text-gray-600 font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">
              Ingrédients
            </label>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Liste des ingrédients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">
              Instructions
            </label>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Instructions pour préparer la recette"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRecipe;
