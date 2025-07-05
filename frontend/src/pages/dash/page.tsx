import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PresentationViewer from "../../components/PresentationViewer";
import ModernLoader from "../../components/Loader";
import ErrorDisplay from "../../components/ErrorDisplay";
import useSlidesStore from "../../store/useSlidesStore";
import { backend_url } from "../../utils/backend";
import axios from "axios";
import Cookies from "js-cookie";
const Page: React.FC = () => {
  const { id } = useParams();
  const { slides, setSlides, setTitle, setPublic } = useSlidesStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const url = `${backend_url}/api/project/${id}/`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const res = response.data;
      setSlides(res.slides);
      setTitle(res.title);
      setProjectTitle(res.title);
      setPublic(res.is_public);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ModernLoader />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!slides || slides.length === 0) {
    return <ErrorDisplay error="No slides found in this presentation" />;
  }

  return <PresentationViewer slides={slides} title={projectTitle} />;
};

export default Page;
