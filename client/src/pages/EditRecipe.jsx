import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function EditRecipe() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  // 📌 Récupérer la recette existante
  useEffect(() => {
    fetch(`http://localhost:5454/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.author !== user._id) {
          alert("Vous n'êtes pas autorisé à modifier cette recette.");
          navigate(`/recipe/${id}`);
          return;
        }
        setTitle(data.title);
        setIngredients(data.ingredients);
        setInstructions(data.instructions);
        setOldImage(data.image);
        console.log("author", data.author);
      })
      .catch((err) => console.error("Erreur lors de la récupération :", err));
  }, [id, user, navigate]);

  // 📌 Soumettre la mise à jour de la recette
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("instructions", instructions);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`http://localhost:5454/api/recipes/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour.");
      }

      alert("Recette modifiée avec succès !");
      navigate(`/recipe/${id}`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Modifier la Recette
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Titre</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">
              Ingrédients
            </label>
            <textarea
              className="w-full p-3 border rounded-lg"
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
              className="w-full p-3 border rounded-lg"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">
              Image actuelle
            </label>
            <img
              src={`http://localhost:5454${oldImage}`}
              alt="Aperçu"
              className="w-full h-40 object-cover mt-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">
              Nouvelle Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Modifier
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRecipe;
