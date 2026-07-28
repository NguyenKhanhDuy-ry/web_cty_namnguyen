import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell app-shell-light">
      <Header />
      <main className="main-shell">
        <Outlet />
      </main>
      {!isAuthenticated ? <Footer /> : null}
    </div>
  );
}

export default MainLayout;
