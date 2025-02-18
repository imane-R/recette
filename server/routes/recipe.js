const express = require("express");
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/** 
 * 📌 ROUTE : Ajouter une nouvelle recette (POST)
 * 🛡️ Authentification requise
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, ingredients, instructions, image } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires" });
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      image: image || "https://via.placeholder.com/500",
      user: req.user.userId, // ID de l'utilisateur connecté
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error("Erreur lors de l'ajout de la recette :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/** 
 * 📌 ROUTE : Récupérer toutes les recettes (GET)
 */
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("user", "username");
    res.json(recipes);
  } catch (err) {
    console.error("Erreur lors de la récupération des recettes :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/** 
 * 📌 ROUTE : Récupérer une seule recette par son ID (GET)
 */
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("user", "username");

    if (!recipe) return res.status(404).json({ message: "Recette non trouvée" });

    res.json(recipe);
  } catch (err) {
    console.error("Erreur lors de la récupération de la recette :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/** 
 * 📌 ROUTE : Modifier une recette (PUT)
 * 🛡️ Authentification requise
 * 🔒 Seul l'auteur de la recette peut modifier
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, ingredients, instructions, image } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: "Recette non trouvée" });

    if (recipe.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.image = image || recipe.image;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    console.error("Erreur lors de la modification de la recette :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/** 
 * 📌 ROUTE : Supprimer une recette (DELETE)
 * 🛡️ Authentification requise
 * 🔒 Seul l'auteur de la recette peut supprimer
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: "Recette non trouvée" });

    if (recipe.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    await recipe.remove();
    res.json({ message: "Recette supprimée avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression de la recette :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
