import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import useSlidesStore from "../../store/useSlidesStore";
import { backend_url } from "../../utils/backend";
import { Home } from "lucide-react";
import {
  Button,
  Input,
  Form,
  InputNumber,
  message,
  Tooltip,
  Tag,
  Spin,
  Alert,
  notification,
} from "antd";
import Cookies from "js-cookie";
import ThemeToggler from "../../components/ThemeToggler";
import { AiOutlineReload } from "react-icons/ai";
import { DeleteOutlined, ThunderboltOutlined } from "@ant-design/icons";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [projectTitle, setProjectTitle] = useState<string | null>(null);
  const [descriptionInput, setDescriptionInput] = useState<string>("");

  const [slideTitles, setSlideTitles] = useState<string[]>([]);

  const navigate = useNavigate();
  const { setSlides, setTitle } = useSlidesStore();
  const token = Cookies.get("token");
  const [fetching, setFetching] = useState(true);
  const location = useLocation();
  const { slide_titles, num_pages } = location.state || {
    slide_titles: [],
    num_pages: 10,
  };
  const [numPages, setNumPages] = useState<number>(num_pages);
  const { id } = useParams();
  const [api, contextHolder1] = notification.useNotification();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/project/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjectTitle(response.data.title || "");
        setDescriptionInput(response.data.description || "");
        setSlideTitles(slide_titles || []);
      } catch (err) {
        console.error(err);
        messageApi.error("Failed to fetch project details");
      } finally {
        setFetching(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleRegenerateOutline = async () => {
    setGenerateLoading(true);
    if (descriptionInput.length < 20 || descriptionInput.trim() === "") {
      messageApi.error("Description must be at least 20 characters long");
      setGenerateLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backend_url}/api/generate-outline/`,
        {
          num_pages: numPages,
          prompt: descriptionInput,
          project_id: id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjectTitle(response.data.title || "");
      setSlideTitles(response.data.slide_titles || []);
      messageApi.success("Outline regenerated successfully!");
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to regenerate outline");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleGenerateSlides = async () => {
    setLoading(true);
    if (slideTitles.some((title) => title.trim() === "")) {
      messageApi.error("Slide titles cannot be empty");
      setLoading(false);
      return;
    }

    api.info({
      message: "Generating AI-Enhanced Presentation...",
      description:
        "Creating your slides with advanced XML layouts and modern design. This may take a few moments.",
      duration: 0,
      icon: <ThunderboltOutlined style={{ color: '#52c41a' }} />,
    });

    try {
      // Use the new XML presentation generation endpoint
      const response = await axios.post(
        `${backend_url}/api/generate-xml-presentation/${id}/`,
        { slide_titles: slideTitles },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSlides(response.data.slides || []);
      setTitle(response.data.title || "");
      const project_id = response.data.project_id;

      api.destroy();
      api.success({
        message: "Presentation Generated Successfully!",
        description: "Your AI-enhanced slides are ready with modern layouts and designs.",
        duration: 4,
      });

      // Navigate to the dashboard
      setTimeout(() => {
        navigate(`/dash/${project_id}`);
      }, 1000);

    } catch (err) {
      console.error(err);
      api.destroy();
      api.error({
        message: "Generation Failed",
        description: "Unable to generate your presentation. Please try again.",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlide = (index: number) => {
    const updatedTitles = slideTitles.filter((_, i) => i !== index);
    setSlideTitles(updatedTitles);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col items-center justify-center p-6">
      {contextHolder}
      {contextHolder1}
      <ThemeToggler />
      <div className="absolute top-4 left-4">
        <Button
          type="default"
          icon={<Home strokeWidth="1" size={19} />}
          onClick={() => navigate("/dashboard")}
        >
          Home
        </Button>
      </div>
      {fetching && (
        <Spin
          spinning
          size="large"
          fullscreen
          percent={"auto"}
          tip="Loading project details..."
        />
      )}
      {!fetching && (
        <div className="p-5 mt-5 md:p-10 md:max-w-[70%]">
          {/* Header with AI Enhancement Badge */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <ThunderboltOutlined className="text-2xl text-green-500 mr-2" />
              <Tag color="green" className="text-sm px-3 py-1">
                AI-Enhanced Generation
              </Tag>
            </div>
            <div className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">
              {projectTitle}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Generate modern presentations with advanced XML layouts
            </p>
          </div>

          {/* Editable Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Project Description
            </label>
            <div className="flex items-center gap-4">
              <Input.TextArea
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                minLength={20}
                maxLength={500}
                style={{ height: 80 }}
                placeholder="Describe your presentation topic in detail..."
                className="flex-1"
              />
              <Tooltip title="Regenerate Outline with AI">
                <Button
                  type="dashed"
                  onClick={handleRegenerateOutline}
                  loading={generateLoading}
                  disabled={generateLoading || loading}
                  icon={<AiOutlineReload />}
                  size="large"
                />
              </Tooltip>
            </div>
          </div>

          {/* Number of Pages */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Number of Slides
            </label>
            <InputNumber
              value={numPages}
              onChange={(value: number | null) => setNumPages(value ?? 10)}
              min={5}
              max={25}
              formatter={(value) => `${value} slides`}
              size="large"
              className="w-full max-w-xs"
            />
          </div>

          {/* Slide Titles */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
              Presentation Outline
            </h3>
            
            {generateLoading && (
              <div className="text-center">
                <Spin size="large" />
                <Alert
                  type="info"
                  message="Generating Outline..."
                  description="AI is creating your presentation structure..."
                  className="mt-4"
                  showIcon
                />
              </div>
            )}
            
            {!generateLoading && (
              <Form onFinish={handleGenerateSlides} className="space-y-4">
                {slideTitles.map((title, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Tag color="blue" className="min-w-[60px] text-center">
                      Slide {index + 1}
                    </Tag>
                    <Input
                      value={title}
                      onChange={(e) => {
                        const updatedTitles = [...slideTitles];
                        updatedTitles[index] = e.target.value;
                        setSlideTitles(updatedTitles);
                      }}
                      placeholder={`Enter title for Slide ${index + 1}`}
                      size="large"
                      className="flex-1"
                      suffix={
                        slideTitles.length > 5 && (
                          <Tooltip title="Delete Slide">
                            <DeleteOutlined
                              onClick={() => handleDeleteSlide(index)}
                              className="cursor-pointer text-red-500 hover:text-red-700"
                            />
                          </Tooltip>
                        )
                      }
                    />
                  </div>
                ))}

                <div className="flex justify-center pt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading || slideTitles.length === 0}
                    size="large"
                    icon={<ThunderboltOutlined />}
                    className="px-8 py-2 h-auto"
                  >
                    {loading ? "Generating AI Presentation..." : "Generate AI-Enhanced Slides"}
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
