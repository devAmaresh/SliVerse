import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/page";
import Dash from "./pages/dash/page";
import Login from "./pages/login/page";
import { ConfigProvider } from "antd";
import { theme as theme1 } from "antd";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./pages/logout/page";
import GenerateSlide from "./pages/generate_slide/page";
import GenerateSlide1 from "./pages/generate_slide/page1";
import Favorites from "./pages/favorites/page";
import Settings from "./pages/settings/page";
import useTheme from "./store/theme";
import Dashboard from "./pages/dashboard/page";
import Landing from "./pages/landing/page";
import Pricing from "./pages/pricing/page";
import Present from "./pages/present/page";
import TermsOfService from "./pages/landing/policy/terms";
import PrivacyPolicy from "./pages/landing/policy/privacy";
import CookiePolicy from "./pages/landing/policy/cookie-policy";
import PageLayout from "./pages/landing/policy/page";
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
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/" element={<Landing />} />
              <Route path="/" element={<Landing />} />
              <Route path="/t/" element={<PageLayout />}>
                {/* Nested Routes render inside <Outlet /> */}
                <Route path="terms" element={<TermsOfService />} />
                <Route path="cookies" element={<CookiePolicy />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
              </Route>
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Home />} />}
              >
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
                path="/generate-slide/:id"
                element={<ProtectedRoute element={<GenerateSlide1 />} />}
              />
              <Route
                path="/dash/:id"
                element={<ProtectedRoute element={<Dash />} />}
              />
              <Route path="/present/:id" element={<Present />} />
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
