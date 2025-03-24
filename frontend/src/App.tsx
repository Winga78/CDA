import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage"; // Page de connexion
import WelcomePage from "./components/WelcomePage";
import SignUpPage from "./components/SignUpPage";
import AccueilPage from "./components/AccueilPage";
import ProjectPage from "./components/ProjectPage";
import ProfilePage from "./components/ProfilePage";
import ChatPage from "./components/ChatPage";
import NotificationPage from "./components/NotificationPage";

function App() {
  // const isAuthenticated = false; // Change this based on your authentication state
  // const user = {}; // Optionally, define the user object here


  return (
    <Router>
    <Routes>
      <Route path="/" element={<Layout isAuthenticated={false} user={{}}/>}>
        <Route index element={<WelcomePage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/" element={<Layout isAuthenticated={true} user={{}}/>}>
        <Route path="/accueil" element={<AccueilPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/project/:projectId" element={<ChatPage />} />
        <Route path="/notifications" element={<NotificationPage />} />

      </Route>

    </Routes>
  </Router>
  )
  // return (
  //   <Router>
  //     <Routes>
  //       {/* Pour les utilisateurs non authentifiés */}
  //       {!isAuthenticated && (
  //         <>
  //           <Route
  //             path="/"
  //             element={
  //               <Layout isAuthenticated={false} user={{}}>
  //                 <WelcomePage />
  //               </Layout>
  //             }
  //           />
  //           <Route
  //             path="/login"
  //             element={
  //               <Layout isAuthenticated={false} user={{}}>
  //                 <LoginPage />
  //               </Layout>
  //             }
  //           />
  //           <Route
  //             path="/register"
  //             element={
  //               <Layout isAuthenticated={false} user={{}}>
  //                 <SignUpPage />
  //               </Layout>
  //             }
  //           />
  //         </>
  //       )}

  //       {/* Pour les utilisateurs authentifiés */}
  //       {isAuthenticated && (
  //         <>
  //           <Route
  //             path="/accueil"
  //             element={
  //               <Layout isAuthenticated={true} user={user}>
  //                 <AccueilPage />
  //               </Layout>
  //             }
  //           />
  //           <Route
  //             path="/profile"
  //             element={
  //               <Layout isAuthenticated={true} user={user}>
  //                 <ProfilePage />
  //               </Layout>
  //             }
  //           />
  //           <Route
  //             path="/notifications"
  //             element={
  //               <Layout isAuthenticated={true} user={user}>
  //                 <NotificationPage />
  //               </Layout>
  //             }
  //           />
  //           <Route
  //             path="/projects"
  //             element={
  //               <Layout isAuthenticated={true} user={user}>
  //                 <ProjectPage />
  //               </Layout>
  //             }
  //           />
  //           <Route
  //             path="/project/chat/:id"
  //             element={
  //               <Layout isAuthenticated={true} user={user}>
  //                 <ChatPage />
  //               </Layout>
  //             }
  //           />
  //         </>
  //       )}
  //     </Routes>
  //   </Router>
  // );
}

export default App;
