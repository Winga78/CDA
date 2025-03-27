import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import WelcomePage from "./components/WelcomePage";
import SignUpPage from "./components/SignUpPage";
import AccueilPage from "./components/AccueilPage";
import ProjectPage from "./components/ProjectPage";
import ProfilePage from "./components/ProfilePage";
import ChatPage from "./components/ChatPage";
import NotificationPage from "./components/NotificationPage";
import AuthGuard from "./services/AuthGuard"; // Import du Guard

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Layout isAuthenticated={false} />}>
          <Route index element={<WelcomePage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Routes protégées */}
        <Route path="/" element={<AuthGuard><Layout isAuthenticated={true} /></AuthGuard>}>
          <Route path="/accueil" element={<AccueilPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/project/:id" element={<ChatPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
