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

module.exports = router;
