import "bootstrap/dist/css/bootstrap.min.css";

const WelcomePage: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="fw-bold" style={{ fontSize: "64px" }}>Bienvenue sur Brainstorming</h1>
        <p className="fw-semibold" style={{ fontSize: "24px" }}>Outil collaboratif, qui repose sur les votes de la communauté</p>
        <div>
          <a href="/login" className="btn btn-outline-dark rounded-pill px-4 py-2 m-2 fw-semibold">Connexion</a>
          <a href="/register" className="btn btn-outline-dark rounded-pill px-4 py-2 m-2 fw-semibold">Inscription</a>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
