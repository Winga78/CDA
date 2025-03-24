import "bootstrap/dist/css/bootstrap.min.css";

const SignUpPage: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div 
        style={{ 
          backgroundColor: "#111111", 
          width: "589px", 
          height: "700px",  // Ajusté pour inclure plus de champs et marges
          borderRadius: "35px", 
          border: "2px solid white" 
        }} 
        className="d-flex flex-column justify-content-center align-items-center p-4"
      >
        {/* Titre centré */}
        <h2 className="text-white fw-semibold mb-5 text-center">Inscription</h2>

        <form className="d-flex flex-column align-items-center w-100">
          {/* Champ Nom */}
          <div className="mb-4 w-100">
            <label htmlFor="firstName" className="form-label text-white">Nom</label>
            <input 
              type="text" 
              id="firstName" 
              className="form-control rounded-pill" 
              placeholder="Entrez votre nom" 
            />
          </div>

          {/* Champ Prénom */}
          <div className="mb-4 w-100">
            <label htmlFor="lastName" className="form-label text-white">Prénom</label>
            <input 
              type="text" 
              id="lastName" 
              className="form-control rounded-pill" 
              placeholder="Entrez votre prénom" 
            />
          </div>

          {/* Champ Date de naissance */}
          <div className="mb-4 w-100">
            <label htmlFor="dob" className="form-label text-white">Date de naissance</label>
            <input 
              type="date" 
              id="dob" 
              className="form-control rounded-pill" 
            />
          </div>

          {/* Champ Email */}
          <div className="mb-4 w-100">
            <label htmlFor="email" className="form-label text-white">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-control rounded-pill" 
              placeholder="Entrez votre email" 
            />
          </div>

          {/* Champ Mot de passe */}
          <div className="mb-4 w-100">
            <label htmlFor="password" className="form-label text-white">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              className="form-control rounded-pill" 
              placeholder="Entrez votre mot de passe" 
            />
          </div>

          {/* Bouton d'inscription */}
          <button 
            type="submit" 
            className="btn btn-outline-light rounded-pill p-3"
            style={{ width: "171px", height: "68px" }}
          >
            Inscription
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
