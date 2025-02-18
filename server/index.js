const express = require("express");
const cors = require("cors");
const app = express();
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Serveur Node.js fonctionne !");
});

const PORT = process.env.PORT || process.env.local.PORT;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.log("❌ Erreur MongoDB :", err));

app.use("/api/auth/register", registerRoutes);
app.use("/api/auth/login", loginRoutes);
app.use("/api/auth/user", userRoutes);

