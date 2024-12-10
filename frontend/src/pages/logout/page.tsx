import { Spin } from "antd";
import { useEffect } from "react";
import Cookies from "js-cookie";

// logout page
const page = () => {
  useEffect(() => {
    Cookies.remove("token");
    window.location.href = "/login";
  }, []);
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Spin size="large" fullscreen spinning />
    </div>
  );
};

export default page;
