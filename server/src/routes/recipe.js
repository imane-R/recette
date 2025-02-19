const express = require("express");
const multer = require("multer");
const path = require("path");
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Configuration Multer pour stocker les images dans "public/uploads"
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 📌 Route POST pour ajouter une recette
router.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    console.log("re");

    try {
      const { title, ingredients, instructions, author } = req.body;

      if (!title || !ingredients || !instructions || !req.file) {
        return res
          .status(400)
          .json({ message: "Tous les champs sont requis." });
      }

      // Création de la recette
      const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
        image: `/uploads/${req.file.filename}`,
        author: author || req.user.userId,
        createdAt: new Date(),
      });

      await newRecipe.save();
      res
        .status(201)
        .json({ message: "Recette ajoutée avec succès", recipe: newRecipe });
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// 📌 Route GET pour récupérer toutes les recettes  (sans authentification)
router.get("/all", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 Route GET pour récupérer une recette par ID (sans authentification)

router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 Modifier une recette (seulement l'auteur)
router.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        return res.status(404).json({ message: "Recette non trouvée" });
      }

      if (recipe.author.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Non autorisé" });
      }

      recipe.title = req.body.title || recipe.title;
      recipe.ingredients = req.body.ingredients || recipe.ingredients;
      recipe.instructions = req.body.instructions || recipe.instructions;

      if (req.file) {
        recipe.image = `/uploads/${req.file.filename}`;
      }

      await recipe.save();
      res.status(200).json({ message: "Recette mise à jour", recipe });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// 📌 Supprimer une recette (seulement si l'utilisateur est l'auteur)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    // Vérification si l'utilisateur est l'auteur
    if (recipe.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer cette recette",
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recette supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
