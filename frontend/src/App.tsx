import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/page";
import Dash from "./pages/dash/page";
import Login from "./pages/login/page";
import { ConfigProvider } from "antd";
import { theme as theme1 } from "antd";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./pages/logout/page";
import GenerateSlide from "./pages/generate_slide/page";
import Favorites from "./pages/favorites/page";
import Settings from "./pages/settings/page";
import useTheme from "./store/theme";
import Dashboard from "./pages/dashboard/page";
import Landing from "./pages/landing/page";
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
              <Route path="/" element={<Landing />} />
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute element={<Home />} />}>
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path="/dashboard/favorites"
                  element={<ProtectedRoute element={<Favorites />} />}
                />
                <Route
                  path="/dashboard/settings"
                  element={<ProtectedRoute element={<Settings />} />}
                />
              </Route>
              <Route
                path="/generate-slide"
                element={<ProtectedRoute element={<GenerateSlide />} />}
              />
              <Route
                path="/dash/:id"
                element={<ProtectedRoute element={<Dash />} />}
              />
              <Route
                path="/logout"
                element={<ProtectedRoute element={<Logout />} />}
              />
            </Routes>
          </Router>
        </ConfigProvider>
      
      </div>
    </div>
  );
}

export default App;
