import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login: loginContext } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      loginContext(token);
      setMessage("Connexion réussie !");
      navigate("/accueil");
    } catch (error : any) {
      setMessage(error.message || "Une erreur inconnue est survenue");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        style={{
          backgroundColor: "#111111",
          width: "589px",
          height: "464px",
          borderRadius: "35px",
          border: "2px solid white",
        }}
        className="d-flex flex-column justify-content-center align-items-center p-4"
      >
        <h2 className="text-white fw-semibold mb-4 text-center">Connexion</h2>

        <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center w-100">
          <div className="mb-3 w-100">
            <label htmlFor="email" className="form-label text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control rounded-pill"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3 w-100">
            <label htmlFor="password" className="form-label text-white">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="form-control rounded-pill"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-outline-light rounded-pill p-3"
            style={{ width: "171px", height: "68px" }}
          >
            Connexion
          </button>
        </form>

        {message && <p className="text-white mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;