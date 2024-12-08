import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const page = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerateSlides = async () => {
    if (!prompt) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Send a POST request to the backend with the user's prompt
      const response = await axios.post(
        "http://localhost:8000/api/generate_slide/",
        {
          prompt: prompt,
        }
      );

      // Navigate to Dash page and pass the response as props
      navigate("/dash", {
        state: { content: response.data },
      });
    } catch (err) {
      setError("Error generating slides. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="w-full max-w-md  p-8 rounded-xl shadow-lg dark:bg-slate-700 border-2 border-stone-700">
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
  );
};

export default page;
