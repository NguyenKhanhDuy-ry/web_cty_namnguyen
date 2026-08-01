import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <div className="app-shell app-shell-light">
      <Header />
      <main className="main-shell">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
