import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { login } from "../../hooks/login";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ThemeToggler from "../../components/ThemeToggler";

const LoginPage = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    try {
      setLoading(true);
      const response = await login(email, password); // Replace with your login function
      Cookies.set("token", response.access);
      messageApi.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      messageApi.error("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <ThemeToggler />
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 md:opacity-30"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-photo/cheerful-3d-alien-world_23-2151879043.jpg')", // Replace with your image path
          }}
        ></div>
        {/*Login Form */}
        <div className="relative z-10 md:flex-1 md:flex justify-center items-center">
          <div
            className="dark:bg-zinc-900 dark:text-white rounded-lg p-8 w-[400px] md:w-full md:max-w-md  bg-white"
            style={{
              boxShadow: "0 0 15px 0 rgba(0,0,0,0.2)",
            }}
          >
            <div className="text-center">
              <div className="text-2xl font-semibold mb-6">Sign in</div>
              <Form
                name="loginForm"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "string", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input placeholder="your@email.com" className="p-3" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                  ]}
                >
                  <Input.Password placeholder="Password" className="p-3" />
                </Form.Item>
                <Form.Item>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="form-checkbox rounded bg-gray-700 text-indigo-500"
                      />
                      <span className="text-sm">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-indigo-400 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="mb-4 bg-indigo-600"
                    size="large"
                    loading={loading}
                    disabled={loading}
                  >
                    Sign in
                  </Button>
                </Form.Item>
              </Form>
              <div className="text-sm text-gray-400 mb-6">
                Don't have an account?{" "}
                <a href="#" className="text-indigo-400 hover:underline">
                  Sign up
                </a>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex-grow h-px bg-gray-600"></div>
                <span className="px-2 text-gray-400 text-sm">or</span>
                <div className="flex-grow h-px bg-gray-600"></div>
              </div>
              <Button block icon={<GoogleOutlined />} size="large">
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
