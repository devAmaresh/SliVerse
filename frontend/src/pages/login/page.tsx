import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { login } from "../../hooks/login";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    try {
      setLoading(true);
      const response = await login(email, password); // Replace with your login function
      Cookies.set("token", response.access);
      messageApi.success("Login successful!");
      navigate("/");
    } catch (error) {
      messageApi.error("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex justify-center items-center dark:bg-black">
        <div
          className="dark:bg-zinc-900 dark:text-white rounded-lg p-8 w-full max-w-md"
          style={{
            boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
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
            <p className="text-sm text-gray-400 mb-6">
              Don't have an account?{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Sign up
              </a>
            </p>
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
    </>
  );
};

export default LoginPage;
