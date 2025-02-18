import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5454/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Utilisateur non authentifié");
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Erreur de récupération du profil :", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        Chargement...
      </div>
    );
  }

  if (!userInfo) {
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
          src={userInfo.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 border"
        />
        <h2 className="text-2xl font-semibold text-gray-700">
          {userInfo.username}
        </h2>
        <p className="text-gray-600">{userInfo.email}</p>
        <p className="text-gray-500 mt-2">
          {userInfo.description || "Aucune description"}
        </p>
      </div>
    </div>
  );
}

export default Profile;
