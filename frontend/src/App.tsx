import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import your components for each route
import Home from "./pages/page";
import Dash from "./pages/dash/page";
import useTheme from "./store/theme";
import { ConfigProvider } from "antd";
import { theme as theme1 } from "antd";
import ThemeToggler from "./components/ThemeToggler";
function App() {
  const theme = useTheme((state: any) => state.theme);

  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <div className="dark:bg-slate-900 dark:text-white">
        <ConfigProvider
          theme={{
            algorithm:
              theme === "dark" ? theme1.darkAlgorithm : theme1.defaultAlgorithm,
          }}
        >
          <Router>
            <Routes>
              {/* Define your routes */}
              <Route path="/" element={<Home />} />
              <Route path="/dash" element={<Dash />} />
            </Routes>
          </Router>
        </ConfigProvider>
        <ThemeToggler />
      </div>
    </div>
  );
}

export default App;
