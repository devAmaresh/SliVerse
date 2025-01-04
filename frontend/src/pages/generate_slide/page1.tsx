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
} from "antd";
import Cookies from "js-cookie";
import ThemeToggler from "../../components/ThemeToggler";
import { AiOutlineReload } from "react-icons/ai";
import { DeleteOutlined } from "@ant-design/icons";

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

  const location = useLocation();
  const { slide_titles, num_pages } = location.state || {
    slide_titles: [],
    num_pages: 10,
  };
  const [numPages, setNumPages] = useState<number>(num_pages);
  const { id } = useParams();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/project/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjectTitle(response.data.title || "");
        setDescriptionInput(response.data.description || ""); // Initialize editable description
        setSlideTitles(slide_titles || []); // Set slide titles if available
      } catch (err) {
        console.error(err);
        messageApi.error("Failed to fetch project details");
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleRegenerateOutline = async () => {
    setGenerateLoading(true);
    if (descriptionInput.length < 20 || descriptionInput.trim() === "") {
      messageApi.error("Description must be at least 20 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backend_url}/api/generate-outline/`,
        {
          num_pages: numPages,
          prompt: descriptionInput, // Send the updated description here
          project_id: id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Assuming the API returns the updated title and slide_titles
      setProjectTitle(response.data.title || "");
      setSlideTitles(response.data.slide_titles || []);
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

    try {
      const response = await axios.post(
        `${backend_url}/api/generate-slide/${id}/`,
        { slide_titles: slideTitles },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSlides(response.data.slides || []);
      setTitle(response.data.title || "");
      const project_id = response.data.project_id;

      navigate(`/dash/${project_id}`);
    } catch (err) {
      console.error(err);
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

      <div className="p-5 mt-5 md:p-10 md:max-w-[70%]">
        {/* Project Title */}
        <div className="text-3xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          {projectTitle}
        </div>

        {/* Editable Description */}
        <div className="py-1">Prompt</div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <Input.TextArea
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            minLength={20}
            maxLength={500}
            style={{ height: 60, maxHeight: 150 }}
            placeholder="Enter project description..."
          />

          <Tooltip title="Regenerate Outline">
            <Button
              type="dashed"
              onClick={handleRegenerateOutline}
              loading={generateLoading}
              disabled={generateLoading}
              icon={<AiOutlineReload />}
            />
          </Tooltip>
        </div>

        {/* Number of Pages */}
        <div className="mb-6">
          <Form.Item className="dark:text-white">
            <InputNumber
              value={numPages}
              onChange={(value: number | null) => setNumPages(value ?? 10)}
              min={10}
              max={30}
              formatter={(value) => `${value} pages`}
            />
          </Form.Item>
        </div>

        {/* Slide Titles */}
        <div className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          Outline
        </div>
        {generateLoading && (
          <Spin spinning size="large">
            <Alert
              type="info"
              message="Loading..."
              description="Please wait while we generate the outline ..."
              style={{
                textAlign: "center",
                height: "200px",
              }}
            />
          </Spin>
        )}
        {!generateLoading && (
          <Form onFinish={handleGenerateSlides}>
            {slideTitles.map((title, index) => (
              <Form.Item
                key={index}
                name={`title_${index}`}
                initialValue={title}
                className="mb-4"
              >
                <div className="flex items-center space-x-1">
                  {/* Tag next to the input */}
                  <Tag color="blue" className="">
                    {index + 1}
                  </Tag>
                  <Input
                    value={title}
                    onChange={(e) => {
                      const updatedTitles = [...slideTitles];
                      updatedTitles[index] = e.target.value;
                      setSlideTitles(updatedTitles);
                    }}
                    className="p-2"
                    placeholder={`Enter title for Slide ${index + 1}`}
                    suffix={
                      <Tooltip title="Delete Slide">
                        <DeleteOutlined
                          onClick={() => handleDeleteSlide(index)}
                          className="cursor-pointer text-red-500"
                        />
                      </Tooltip>
                    }
                  />
                </div>
              </Form.Item>
            ))}

            <div className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                Generate Slides
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Page;
