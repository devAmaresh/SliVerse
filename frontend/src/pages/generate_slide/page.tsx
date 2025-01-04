import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backend_url } from "../../utils/backend";
import { Home } from "lucide-react";
import { Button, Input, Form, Slider } from "antd";
import Cookies from "js-cookie";
import ThemeToggler from "../../components/ThemeToggler";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const handleGenerateSlides = async (values: any) => {
    const { prompt, num_pages } = values;
    console.log(values);

    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${backend_url}/api/generate-outline/`,
        { prompt, num_pages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const project_id = response.data.project_id;
      const slideTitles = response.data.slide_titles;
      // Navigate to the Page component
      navigate(`/generate-slide/${project_id}`, {
        state: { slide_titles: slideTitles, num_pages: num_pages },
      });
    } catch (err) {
      setError("Error generating slides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { TextArea } = Input;

  return (
    <div className="h-screen">
      <ThemeToggler />
      <div className="flex justify-start p-4">
        <Button
          type="default"
          icon={<Home strokeWidth="1" size={"19"} />}
          onClick={() => navigate("/dashboard")}
        >
          Home
        </Button>
      </div>
      <div className="mt-20 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg dark:bg-zinc-900 border-2 border-zinc-200 dark:border-stone-700">
          <div className="text-2xl font-bold text-center mb-4">
            Generate Outline for Slides
          </div>

          <Form
            name="generateSlides"
            onFinish={handleGenerateSlides}
            layout="vertical"
          >
            <Form.Item
              name="prompt"
              rules={[
                {
                  required: true,
                  message: "Please enter a prompt for generating slides!",
                },
                { min: 20, message: "Prompt must be at least 20 characters!" },
              ]}
              className="mb-8"
            >
              <TextArea
                placeholder="Enter prompt for slides..."
                style={{ maxHeight: "200px" }}
                className="p-3"
              />
            </Form.Item>
            <Form.Item
              name="num_pages"
              label="Number of Slides"
              rules={[
                {
                  required: true,
                },
              ]}
              className="mb-8"
              initialValue={10}
            >
              <Slider min={10} max={30} step={1} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                loading={loading}
                size="large"
                className="w-full text-white p-3 rounded-md"
              >
                {loading ? "Generating..." : "Generate Slides"}
              </Button>
            </Form.Item>
          </Form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Page;
