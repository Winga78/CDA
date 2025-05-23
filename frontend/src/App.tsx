import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import WelcomePage from "./components/WelcomePage";
import SignUpPage from "./components/SignUpPage";
import AccueilPage from "./components/AccueilPage";
import ProjectPage from "./components/ProjectPage";
import ProfilePage from "./components/ProfilePage";
import NotificationPage from "./components/NotificationPage";
import {UserProvider} from "./context/UserContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ChatPage from "./components/ChatPage";
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import PolitiqueCookies from './pages/PolitiqueCookies';
import ConditionsVente from './pages/ConditionsVente';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<PublicRoute><Layout/></PublicRoute>}>
          <Route index element={<WelcomePage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Routes protégées */}
        <Route path="/" element={<PrivateRoute><Layout/></PrivateRoute>}>
          <Route path="/accueil" element={<AccueilPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/project/:id" element={<ChatPage />} />
        </Route>
         <Route path="/mentions-legales" element={<MentionsLegales />} />
         <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
         <Route path="/politique-cookies" element={<PolitiqueCookies />} />
         <Route path="/conditions-generales-vente" element={<ConditionsVente />} />
         </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
