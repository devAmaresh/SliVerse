import React from 'react';
import { Button } from 'antd';
import { PlusOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const EmptySlideDisplay: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <RocketOutlined className="text-5xl text-white" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Ready to Create?
        </h2>
        <p className="text-gray-600 mb-2 text-xl">
          This presentation is empty and waiting for your amazing content.
        </p>
        <p className="text-gray-500 mb-8 text-lg">
          Let's build something incredible together!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />}
            onClick={() => navigate(`/generate-slide/${id}`)}
            className="w-full h-14 text-xl bg-gradient-to-r from-purple-500 to-blue-600 border-0 hover:from-purple-600 hover:to-blue-700 shadow-lg"
          >
            Generate AI Slides
          </Button>
          <Button 
            size="large" 
            onClick={() => navigate('/dashboard')}
            className="w-full h-12 text-lg"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Features List */}
        <div className="mt-12 text-left bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">What you can create:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Interactive timelines and processes
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Beautiful comparison charts
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              Icon-based feature showcases
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
              Data visualizations and more
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptySlideDisplay;