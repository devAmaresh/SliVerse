import React, { useState, useEffect } from 'react';
import { Palette, Image, Layout, Save, X } from 'lucide-react';
import useSlidesStore from '../store/useSlidesStore';
import axios from 'axios';
import Cookies from 'js-cookie';
import { backend_url } from '../utils/backend';

interface SlideEditorProps {
  slideIndex: number;
  onClose: () => void;
}

const SlideEditor: React.FC<SlideEditorProps> = ({ slideIndex, onClose }) => {
  const { slides, updateSlide } = useSlidesStore();
  const slide = slides[slideIndex];
  const [editedSlide, setEditedSlide] = useState({ ...slide });
  const [isSaving, setIsSaving] = useState(false);

  const token = Cookies.get("token");

  // Update local state when store slide changes
  useEffect(() => {
    if (slides[slideIndex]) {
      setEditedSlide({ ...slides[slideIndex] });
    }
  }, [slides, slideIndex]);

  const sectionLayouts = [
    { value: 'vertical', label: 'Vertical', icon: '⬆️', description: 'Image on top' },
    { value: 'left', label: 'Left', icon: '⬅️', description: 'Image on left' },
    { value: 'right', label: 'Right', icon: '➡️', description: 'Image on right' }
  ];

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
  ];

  const handleSectionLayoutChange = (layout: string) => {
    setEditedSlide(prev => ({
      ...prev,
      section_layout: layout
    }));
  };

  const handleColorChange = (color: string) => {
    setEditedSlide(prev => ({
      ...prev,
      dominant_color: color
    }));
  };

  const handleImageUrlChange = (url: string) => {
    setEditedSlide(prev => ({
      ...prev,
      img_url: url
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update the slide in the backend
      const response = await axios.patch(
        `${backend_url}/api/slide-edit/${editedSlide.id}/`,
        {
          section_layout: editedSlide.section_layout,
          img_url: editedSlide.img_url,
          dominant_color: editedSlide.dominant_color,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the store with the new slide data
        updateSlide(slideIndex, editedSlide);
        console.log('Slide updated successfully');
        onClose();
      }
    } catch (error) {
      console.error('Failed to update slide:', error);
      // You might want to show a toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  if (!slide) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Edit Slide {slideIndex + 1}</h2>
              <p className="text-gray-400 text-sm">Customize layout, image, and colors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Panel - Controls */}
            <div className="space-y-8">
              
              {/* Section Layout */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Layout className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold">Section Layout</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {sectionLayouts.map((layout) => (
                    <button
                      key={layout.value}
                      onClick={() => handleSectionLayoutChange(layout.value)}
                      className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                        editedSlide.section_layout === layout.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
                      }`}
                    >
                      <div className="text-2xl mb-2">{layout.icon}</div>
                      <div className="font-medium text-sm">{layout.label}</div>
                      <div className="text-xs opacity-75 mt-1">{layout.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Image className="w-5 h-5 text-green-400" />
                  <h3 className="text-white font-semibold">Image URL</h3>
                </div>
                
                {/* Image URL Input */}
                <div className="space-y-3">
                  <label className="text-sm text-gray-400">Enter image URL</label>
                  <input
                    type="url"
                    value={editedSlide.img_url || ''}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  />
                  <p className="text-xs text-gray-500">Paste a direct link to an image (jpg, png, gif, etc.)</p>
                </div>
              </div>

              {/* Color Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">Dominant Color</h3>
                </div>
                
                {/* Color Picker */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={editedSlide.dominant_color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editedSlide.dominant_color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Predefined Colors */}
                <div className="grid grid-cols-6 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                        editedSlide.dominant_color === color
                          ? 'border-white scale-110'
                          : 'border-gray-600 hover:border-gray-400 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <span>Live Preview</span>
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: editedSlide.dominant_color }}
                />
              </h3>
              
              <div className="bg-black rounded-xl p-6 border border-gray-800">
                {/* Mini slide preview */}
                <div 
                  className="w-full h-48 rounded-lg border border-gray-700 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${editedSlide.dominant_color}20, ${editedSlide.dominant_color}05)`
                  }}
                >
                  {editedSlide.img_url ? (
                    <>
                      <img
                        src={editedSlide.img_url}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg" />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Layout: {editedSlide.section_layout}
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Image className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No image</p>
                      <p className="text-xs text-gray-600 mt-1">Layout: {editedSlide.section_layout}</p>
                    </div>
                  )}
                </div>

                {/* Layout visualization */}
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-400">Current Settings:</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Layout:</span>
                      <span className="text-white capitalize">{editedSlide.section_layout}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color:</span>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-600"
                          style={{ backgroundColor: editedSlide.dominant_color }}
                        />
                        <span className="text-white">{editedSlide.dominant_color}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Image:</span>
                      <span className="text-white">
                        {editedSlide.img_url ? '✓ Set' : '✗ None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400 flex items-center space-x-2">
              <span>💡</span>
              <span>Changes are applied instantly to the preview</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideEditor;