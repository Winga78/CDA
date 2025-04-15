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
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
