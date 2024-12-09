// hooks/useSlides.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from "../utils/backend";
import Cookies from "js-cookie";

export const useProject = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setError("No token found");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${backend_url}/api/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Slides:", response.data);
        setProjects(response.data); // Assuming the API returns an array directly
      } catch (err) {
        console.error("Error fetching slides:", err);
        setError("Failed to load presentations.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty array means this effect runs once when the component mounts

  return { projects, loading, error };
};
