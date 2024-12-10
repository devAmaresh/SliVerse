import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useSlidesStore from "../../store/useSlidesStore";
import { backend_url } from "../../utils/backend";
import { Home } from "lucide-react";
import { Button, Input, Form } from "antd";
import Cookies from "js-cookie";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSlides, setTitle } = useSlidesStore();
  const token = Cookies.get("token");

  const handleGenerateSlides = async (values: any) => {
    const { prompt } = values;

    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${backend_url}/api/generate_slide/`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update slides in Zustand
      setSlides(response.data.slides || []);
      setTitle(response.data.title || "");
      const project_id = response.data.project_id;

      // Navigate to the Page component
      navigate(`/dash/${project_id}`);
    } catch (err) {
      setError("Error generating slides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { TextArea } = Input;

  return (
    <div className="h-screen">
      <div className="flex justify-start p-4">
        <Button
          type="default"
          icon={<Home strokeWidth="1" size={"19"} />}
          onClick={() => navigate("/")}
        >
          Home
        </Button>
      </div>
      <div className="mt-20 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg dark:bg-zinc-900 border-2 border-zinc-200 dark:border-stone-700">
          <div className="text-2xl font-bold text-center mb-4">
            Generate Slides
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
              />
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
