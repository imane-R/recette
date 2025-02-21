import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const { user, toggleFavorite } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5454/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération de la recette :", err)
      );
  }, [id]);

  // 📌 Récupérer les commentaires avec pagination
  useEffect(() => {
    fetch(
      `http://localhost:5454/api/comments/${id}?page=${currentPage}&limit=5`
    )
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error("Erreur commentaires :", err));
  }, [id, currentPage]);

  console.log("comments", comments);

  // 📌 Ajouter un commentaire
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const response = await fetch("http://localhost:5454/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: newComment, recipeId: id }),
      });

      if (!response.ok)
        throw new Error("Erreur lors de l'ajout du commentaire");

      const data = await response.json();
      setComments((prev) => [data.comment, ...prev]); // Ajoute le nouveau commentaire en haut
      setNewComment(""); // Réinitialiser le champ
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  // 📌 Récupérer l'utilisateur
  useEffect(() => {
    if (recipe && typeof recipe.author === "string") {
      fetch(`http://localhost:5454/api/auth/user/${recipe.author}`)
        .then((res) => res.json())
        .then((data) =>
          setRecipe((prevRecipe) => ({
            ...prevRecipe,
            author: data,
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
              {/* 📌 Bouton Ajouter/Supprimer des favoris */}
              {user && (
                <button
                  onClick={() => toggleFavorite(recipe._id)}
                  className={`px-4 py-2 mt-4 rounded-md text-white ${
                    user.favorites?.includes(recipe._id)
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                >
                  {user.favorites?.includes(recipe._id)
                    ? "❤️ Retirer des favoris"
                    : "💙 Ajouter aux favoris"}
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-700">Chargement...</p>
          )}
        </div>
        {/* 📌 Section Commentaires */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-700">Commentaires</h3>
          {/* ✅ Formulaire pour ajouter un commentaire */}
          {user && (
            <form onSubmit={handleCommentSubmit} className="my-4">
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Ajoutez un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Commenter
              </button>
            </form>
          )}
          {/* ✅ Liste des commentaires */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="p-4 bg-gray-100 rounded-md">
                <p className="font-semibold text-gray-800">
                  {comment.author?.username}{" "}
                  <span className="text-gray-500 text-sm">
                    ({new Date(comment.createdAt).toLocaleDateString()})
                  </span>
                </p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))}
            {/* 📌 Pagination des commentaires */}
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
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
              >
                ▶️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipe;
