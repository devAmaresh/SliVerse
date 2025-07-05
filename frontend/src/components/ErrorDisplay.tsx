import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-2 text-lg">
          {error}
        </p>
        <p className="text-gray-500 mb-8">
          Don't worry, let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            type="primary" 
            size="large" 
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
          >
            Try Again
          </Button>
          <Button 
            size="large" 
            icon={<HomeOutlined />}
            onClick={() => navigate('/dashboard')}
            className="w-full h-12 text-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;