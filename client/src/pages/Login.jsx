import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5454/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      login(data.token);
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Connexion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Mot de passe
              </label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Se connecter
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Pas encore de compte ?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Inscrivez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
