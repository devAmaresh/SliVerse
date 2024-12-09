import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/page";
import Dash from "./pages/dash/page";
import Login from "./pages/login/page";
import { ConfigProvider } from "antd";
import { theme as theme1 } from "antd";
import ThemeToggler from "./components/ThemeToggler";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./pages/logout/page";
import GenerateSlide from "./pages/generate_slide/page";
import Favorites from "./pages/favorites/page";
import Settings from "./pages/settings/page";
import useTheme from "./store/theme";
import Dashboard from "./components/dash";
function App() {
  const theme = useTheme((state: any) => state.theme);

  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <div className="dark:bg-black dark:text-white">
        <ConfigProvider
          theme={{
            algorithm:
              theme === "dark" ? theme1.darkAlgorithm : theme1.defaultAlgorithm,
          }}
        >
          <Router>
            <Routes>
              {/* Login route (accessible to everyone) */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute element={<Home />} />}>
                <Route
                  path=""
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path="/favorites"
                  element={<ProtectedRoute element={<Favorites />} />}
                />
                <Route
                  path="/settings"
                  element={<ProtectedRoute element={<Settings />} />}
                />
              </Route>
              <Route
                path="/generate-slide"
                element={<ProtectedRoute element={<GenerateSlide />} />}
              />
              <Route
                path="/dash"
                element={<ProtectedRoute element={<Dash />} />}
              />
              <Route
                path="/logout"
                element={<ProtectedRoute element={<Logout />} />}
              />
            </Routes>
          </Router>
        </ConfigProvider>
        <ThemeToggler />
      </div>
    </div>
  );
}

export default App;
