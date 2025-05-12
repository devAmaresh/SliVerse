import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

const PageLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header stays on top */}
      <Header />

      {/* Page content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default PageLayout;
