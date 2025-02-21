import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //  État pour gérer le chargement

  // Vérifier si un utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("🔍 Token récupéré au chargement :", token);

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5454/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("⚠️ Token invalide, suppression du token !");
          localStorage.removeItem("token"); // ✅ Supprime le token s'il est invalide
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Utilisateur connecté :", data);
        setUser(data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); // ✅ Met fin au chargement
  }, []);

  const login = (token) => {
    console.log("🔑 Connexion réussie, token reçu :", token);
    localStorage.setItem("token", token);

    fetch("http://localhost:5454/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          console.error("⚠️ Erreur lors de la récupération du profil !");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Utilisateur connecté après login :", data);
        setUser(data);
        console.log("data iciiiii", data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  };

  const logout = () => {
    console.log("🚪 Déconnexion de l'utilisateur");
    localStorage.removeItem("token");
    setUser(null);
  };
  const toggleFavorite = async (recipeId) => {
    if (!user) return alert("Connectez-vous pour ajouter aux favoris.");

    try {
      const response = await fetch(
        `http://localhost:5454/api/auth/user/${user._id}/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ recipeId }),
        }
      );
      console.log("recipeId", recipeId);
      console.log("responseeeeeeee", response);
      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour des favoris");

      const data = await response.json();
      console.log("🛠 Favoris mis à jour :", data.favorites);

      setUser((prevUser) => ({ ...prevUser, favorites: data.favorites }));
    } catch (error) {
      console.error("Erreur favoris :", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, toggleFavorite }}
    >
      {children}
    </AuthContext.Provider>
  );
};
