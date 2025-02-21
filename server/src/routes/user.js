const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route pour récupérer le profil utilisateur connecté
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclure le mot de passe
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(user);
  } catch (err) {
    console.error("❌ Erreur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour récupérer un utilisateur par ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclure le mot de passe
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    console.error("❌ Erreur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 Ajouter ou supprimer une recette des favoris
router.post("/:id/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { recipeId } = req.body;

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.favorites.includes(recipeId)) {
      // ✅ Supprimer des favoris si déjà ajouté
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== recipeId
      );
    } else {
      // ✅ Ajouter aux favoris
      user.favorites.push(recipeId);
    }

    await user.save();
    res.json({ favorites: user.favorites, message: "Favoris mis à jour" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des favoris :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 Récupérer les favoris d'un utilisateur
router.get("/:id/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
