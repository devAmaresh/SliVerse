import { FloatButton } from "antd";
import { CiDark, CiLight } from "react-icons/ci";
import useTheme from "../store/theme";
const ThemeToggler = () => {
  const toggleTheme = useTheme((state: any) => state.toggleTheme);
  const theme = useTheme((state: any) => state.theme);
  return (
    <FloatButton
      onClick={toggleTheme}
      icon={theme === "dark" ? <CiLight /> : <CiDark />}
    />
  );
};

export default ThemeToggler;
