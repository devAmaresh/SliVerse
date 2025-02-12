import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { backend_url } from "../utils/backend";
import useProjectStore from "../store/projectStore";
import { message } from "antd";
const useProjectDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { removeProject } = useProjectStore();
  const deleteProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = Cookies.get("token");

      const response = await axios.delete(
        `${backend_url}/api/projects/${projectId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        setSuccess(true); // Successfully deleted
        removeProject(projectId);
        message.success("Project deleted successfully.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting project.");
      message.error("Error deleting project. Please try again later !");
    } finally {
      setLoading(false);
    }
  };

  return { deleteProject, loading, error, success };
};

export default useProjectDelete;
