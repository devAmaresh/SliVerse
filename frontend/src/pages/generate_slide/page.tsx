import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useSlidesStore from "../../store/useSlidesStore";
import { backend_url } from "../../utils/backend";
import { Home } from "lucide-react";
import { Button } from "antd";
const page = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSlides } = useSlidesStore();
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerateSlides = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backend_url}/api/generate_slide/`, {
        prompt,
      });

      // Update slides in Zustand
      setSlides(response.data.slides || []);

      // Navigate to the Page component
      navigate("/dash", { state: { content: response.data } });
    } catch (err) {
      setError("Error generating slides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          <div className="w-full max-w-md  p-8 rounded-xl shadow-lg dark:bg-zinc-900 border-2 border-stone-700">
            <h1 className="text-2xl font-bold text-center mb-4">
              Generate AI Slides
            </h1>
            <input
              type="text"
              placeholder="Enter prompt for slides..."
              value={prompt}
              onChange={handlePromptChange}
              className="w-full p-3 border border-stone-300 rounded-md mb-4 text-black focus:outline-none"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={handleGenerateSlides}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? "Generating..." : "Generate Slides"}
              </button>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
