import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";
import useProjectStore from "../store/projectStore";
import { message } from "antd";

const useProjectUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { updateProject } = useProjectStore();

  const upd = async (projectId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = Cookies.get("token");

      const response = await axios.patch(
        `${backend_url}/api/projects/${projectId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        updateProject(projectId, response.data);
        message.success("Project updated successfully.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating project.");
      message.error("Error updating project. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (projectId: string, currentFavoriteStatus: boolean) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = Cookies.get("token");

      const response = await axios.patch(
        `${backend_url}/api/projects/${projectId}/`,
        { is_favorite: !currentFavoriteStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        updateProject(projectId, response.data);
        message.success(
          !currentFavoriteStatus 
            ? "Added to favorites!" 
            : "Removed from favorites!"
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating favorite status.");
      message.error("Error updating favorite status. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return { upd, toggleFavorite, loading, error, success };
};

export default useProjectUpdate;
