const express = require("express");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Ajouter un commentaire à une recette
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content, recipeId } = req.body;
    if (!content || !recipeId) {
      return res.status(400).json({ message: "Contenu et recette requis." });
    }

    const comment = new Comment({
      content,
      author: req.user.userId,
      recipe: recipeId,
    });

    await comment.save();
    res.status(201).json({ message: "Commentaire ajouté !", comment });
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 Récupérer les commentaires d'une recette avec pagination
router.get("/:id", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5; // 5 commentaires par page

    const total = await Comment.countDocuments({ recipeId: req.params.id });

    const comments = await Comment.find({ recipeId: req.params.id })
      .sort({ createdAt: -1 }) // Trier du plus récent au plus ancien
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "username");

    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Erreur récupération commentaires :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
