import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Impossible de récupérer les informations de l'utilisateur.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto text-center">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 border"
        />
        <h2 className="text-2xl font-semibold text-gray-700">
          {user.username}
        </h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500 mt-2">
          {user.description || "Aucune description"}
        </p>
      </div>
    </div>
  );
}

export default Profile;
