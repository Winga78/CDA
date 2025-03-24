import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div 
        style={{ 
          backgroundColor: "#111111", 
          width: "589px", 
          height: "464px", 
          borderRadius: "35px", 
          border: "2px solid white" 
        }} 
        className="d-flex flex-column justify-content-center align-items-center p-4"
      >
        {/* Titre centré */}
        <h2 className="text-white fw-semibold mb-4 text-center">Connexion</h2>

        <form className="d-flex flex-column align-items-center w-100">
          <div className="mb-3 w-100">
            <label htmlFor="email" className="form-label text-white">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-control rounded-pill" 
              placeholder="Entrez votre email" 
            />
          </div>

          <div className="mb-3 w-100">
            <label htmlFor="password" className="form-label text-white">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              className="form-control rounded-pill" 
              placeholder="Entrez votre mot de passe" 
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
      </div>
    </div>
  );
};

export default LoginPage;
