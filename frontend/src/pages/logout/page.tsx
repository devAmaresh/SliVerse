import { Spin } from "antd";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
// logout page
const page = () => {
  const navigate = useNavigate();
  useEffect(() => {
    Cookies.remove("token");
    navigate("/login");
  }, []);
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Spin size="large" fullscreen spinning />
    </div>
  );
};

export default page;
