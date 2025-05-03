import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { signUp } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { User } from "../models/User";

const SignUpPage: React.FC = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    birthday: "",
  });
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Fonction de soumission du formulaire
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signUp(user);
      setMessage("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      setMessage("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        style={{
          backgroundColor: "#111111",
          width: "589px",
          height: "700px",
          borderRadius: "35px",
          border: "2px solid white",
        }}
        className="d-flex flex-column justify-content-center align-items-center p-4"
      >
        <h2 className="text-white fw-semibold mb-5 text-center">Inscription</h2>

        <form className="d-flex flex-column align-items-center w-100" onSubmit={handleSignUp}>
          <div className="mb-4 w-100">
            <label htmlFor="firstname" className="form-label text-white">Nom</label>
            <input 
              type="text" 
              id="firstname" 
              name="firstname"
              className="form-control rounded-pill" 
              placeholder="Entrez votre nom" 
              onChange={handleChange}
              value={user.firstname}
            />
          </div>

          <div className="mb-4 w-100">
            <label htmlFor="lastname" className="form-label text-white">Prénom</label>
            <input 
              type="text" 
              id="lastname" 
              name="lastname"
              className="form-control rounded-pill" 
              placeholder="Entrez votre prénom" 
              onChange={handleChange}
              value={user.lastname} 
            />
          </div>

          <div className="mb-4 w-100">
            <label htmlFor="birthday" className="form-label text-white">Date de naissance</label>
            <input 
              type="date" 
              id="birthday" 
              name="birthday"
              className="form-control rounded-pill" 
              onChange={handleChange}
              value={user.birthday}
            />
          </div>

          <div className="mb-4 w-100">
            <label htmlFor="email" className="form-label text-white">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className="form-control rounded-pill" 
              placeholder="Entrez votre email" 
              onChange={handleChange}
              value={user.email}
            />
          </div>

          <div className="mb-4 w-100">
            <label htmlFor="password" className="form-label text-white">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className="form-control rounded-pill" 
              placeholder="Entrez votre mot de passe" 
              onChange={handleChange}
              value={user.password}
            />
          </div>

          <button
            type="submit"
            className="btn btn-outline-light rounded-pill p-3"
            style={{ width: "171px", height: "68px" }}
          >
            Inscription
          </button>
        </form>

        {message && <p className="text-white mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default SignUpPage;
