import axios from "axios";
import Cookies from "js-cookie";
import { Form, Input, Button, message } from "antd"; // Import Ant Design components
import { backend_url } from "../utils/backend";
import useSlidesStore from "../store/useSlidesStore";

const ImgChange = ({
  index_id,
  slide_id,
}: {
  index_id: number;
  slide_id: string;
}) => {
  const [form] = Form.useForm();
  const updateSlide = useSlidesStore((state: any) => state.updateSlide);
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: { img_url: string }) => {
    const { img_url } = values;

    const token = Cookies.get("token");

    try {
      const response = await axios.patch(
        `${backend_url}/api/slide-edit/${slide_id}/`,
        { img_url },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      messageApi.success("Image updated successfully!");
      updateSlide(index_id, response.data.slide);
      form.resetFields();
    } catch (error) {
      messageApi.error("Error updating the image. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {contextHolder}
      <Form form={form} onFinish={onFinish} layout="vertical" className="w-80">
        <Form.Item
          // label="Image URL"
          name="img_url"
          rules={[
            { required: true, message: "Please enter a valid image URL!" },
            { type: "url", message: "Please enter a valid URL!" },
          ]}
        >
          <Input placeholder="Enter Image URL" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block className="shadow-md">
          Change Image
        </Button>
      </Form>
    </div>
  );
};

export default ImgChange;
