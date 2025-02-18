const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Accès refusé, token manquant ou mal formé" });
  }

  const token = authHeader.split(" ")[1]; // Extraire uniquement le token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Utilisateur authentifié :", req.user);

    req.user = decoded; // Ajouter l'utilisateur au `req`
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};
