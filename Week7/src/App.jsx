import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import GitHubPage from "./pages/GitHubPage";
import LoginPage from "./pages/LoginPage";

function NotFoundPage() {
  return <p>Page not found.</p>;
}

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/github" element={<GitHubPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
