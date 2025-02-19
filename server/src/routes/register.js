const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

router.post(
  "/",
  [
    check("username", "Le nom d'utilisateur est requis").not().isEmpty(),
    check("email", "L'email est invalide").isEmail(),
    check(
      "password",
      "Le mot de passe doit contenir au moins 6 caractères"
    ).isLength({ min: 6 }),
    check("description", "La description est requise").not().isEmpty(),
    check("avatar", "L'avatar est requis").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password, description, avatar } = req.body;

    try {
      console.log("🔍 Vérification si l'utilisateur existe...");
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        console.log("❌ Utilisateur déjà existant !");
        return res
          .status(400)
          .json({ message: "Cet email ou ce nom d'utilisateur existe déjà" });
      }

      console.log("✅ Utilisateur non existant, création...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      console.log("🔑 Mot de passe haché avec succès.");
      const user = new User({
        username,
        email,
        password: hashedPassword,
        description,
        avatar,
      });

      await user.save();
      console.log("✅ Utilisateur enregistré dans la base de données.");

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log("🔐 Token généré avec succès.");
      res.json({ token, user: { id: user._id, username, email } });
    } catch (err) {
      console.error("❌ Erreur dans le backend :", err);
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
  }
);

module.exports = router;
