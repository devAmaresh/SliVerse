import React, { useState } from "react";
import { Steps, Button, Input, Spin, message, Typography } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";
import useSlideStore from "../store/useSlidesStore";

const { Text } = Typography;

const AddSlide: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [slideTitles, setSlideTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const token = Cookies.get("token");

  const { setSlides } = useSlideStore();

  // Fetch suggested slide titles
  const fetchSlideTitles = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${backend_url}/api/suggest-slide-title/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { slide_titles } = response.data;

      if (Array.isArray(slide_titles)) {
        setSlideTitles(slide_titles);
        message.success("Slide titles fetched successfully!");
        setCurrentStep(1); // Move to Step 2
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (err: any) {
      message.error(
        err.response?.data?.error || "Failed to fetch slide titles."
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate the slide with the selected/modified title
  const generateSlide = async () => {
    if (!selectedTitle) {
      message.error("Please select or enter a slide title first.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backend_url}/api/add-slide/${id}/`,
        { title: selectedTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      // Update Zustand store
      setSlides(data.slides);

      message.success("Slide generated successfully!");
      setCurrentStep(3); // Move to confirmation
    } catch (err: any) {
      message.error(err.response?.data?.error || "Failed to generate slide.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Fetch Titles",
      description: "Click the button to get suggested slide titles.",
      content: (
        <div className="text-center">
          <Button type="dashed" onClick={fetchSlideTitles} disabled={loading}>
            {loading ? <Spin /> : "Fetch Suggested Slide Titles"}
          </Button>
        </div>
      ),
    },
    {
      title: "Select Title",
      description: "Select one title from the suggestions.",
      content: (
        <div className="space-y-4 overflow-y-auto h-60">
          {slideTitles.map((title, index) => (
            <div key={index} className="flex items-center gap-4">
              <Input value={title} readOnly />
              <Button
                type="primary"
                onClick={() => {
                  setSelectedTitle(title);
                  setCurrentStep(2); // Move to Step 3
                }}
              >
                Select
              </Button>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Confirm or Edit",
      description: "Confirm or modify the selected title.",
      content: (
        <div className="space-y-4">
          <Text>Modify the title if needed and click 'Generate Slide':</Text>
          <div className="flex items-center gap-4">
            <Input
              value={selectedTitle || ""}
              onChange={(e) => setSelectedTitle(e.target.value)}
              placeholder="Edit the selected title"
            />
            <Button
              type="dashed"
              onClick={generateSlide}
              disabled={loading}
              loading={loading}
            >
              Generate Slide
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Success",
      description: "Your slide has been created!",
      content: (
        <p className="text-center">Your slide was created successfully! 🎉</p>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Steps current={currentStep} className="mb-6">
        {steps.map((step, index) => (
          <Steps.Step
            key={index}
            title={step.title}
            description={step.description}
          />
        ))}
      </Steps>
      <div>{steps[currentStep].content}</div>
    </div>
  );
};

export default AddSlide;
