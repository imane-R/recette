import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import AddRecipe from "./pages/AddRecipe";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="*" element={<div>404 - Page non trouvée</div>} />
            <Route path="/recipe/:id" element={<Recipe />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
