import React, { useState } from 'react';
import { Type, Plus, Trash2, Edit3 } from 'lucide-react';

interface ContentEditorProps {
  content: any;
  layoutType: string;
  onContentChange: (updatedContent: any) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  content, 
  layoutType, 
  onContentChange 
}) => {
  const [editingItem, setEditingItem] = useState<number | null>(null);

  const updateContent = (newContent: any) => {
    onContentChange(newContent);
  };

  const updateTitle = (newTitle: string) => {
    updateContent({ ...content, title: newTitle, heading: newTitle });
  };

  const addItem = () => {
    const newContent = { ...content };
    
    switch (layoutType) {
      case 'columns':
        if (!newContent.columns) newContent.columns = [];
        newContent.columns.push({
          heading: 'New Column',
          description: 'Add your description here...'
        });
        break;
      case 'bullets':
        if (!newContent.bullets) newContent.bullets = [];
        newContent.bullets.push({
          heading: 'New Point',
          text: 'Add your bullet point here...'
        });
        break;
      case 'icons':
        if (!newContent.icons) newContent.icons = [];
        newContent.icons.push({
          icon: 'star',
          heading: 'New Icon',
          description: 'Add your description here...'
        });
        break;
      case 'timeline':
      case 'cycle':
      case 'arrows':
      case 'pyramid':
      case 'staircase':
        if (!newContent.steps) newContent.steps = [];
        newContent.steps.push({
          title: 'New Step',
          description: 'Add your step description here...'
        });
        break;
      case 'chart':
        if (!newContent.data) newContent.data = [];
        newContent.data.push({
          label: 'New Item',
          data: '50'
        });
        break;
    }
    
    updateContent(newContent);
  };

  const removeItem = (index: number) => {
    const newContent = { ...content };
    
    switch (layoutType) {
      case 'columns':
        newContent.columns?.splice(index, 1);
        break;
      case 'bullets':
        newContent.bullets?.splice(index, 1);
        break;
      case 'icons':
        newContent.icons?.splice(index, 1);
        break;
      case 'timeline':
      case 'cycle':
      case 'arrows':
      case 'pyramid':
      case 'staircase':
        newContent.steps?.splice(index, 1);
        break;
      case 'chart':
        newContent.data?.splice(index, 1);
        break;
    }
    
    updateContent(newContent);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newContent = { ...content };
    
    switch (layoutType) {
      case 'columns':
        if (newContent.columns?.[index]) {
          newContent.columns[index][field] = value;
        }
        break;
      case 'bullets':
        if (newContent.bullets?.[index]) {
          newContent.bullets[index][field] = value;
        }
        break;
      case 'icons':
        if (newContent.icons?.[index]) {
          newContent.icons[index][field] = value;
        }
        break;
      case 'timeline':
      case 'cycle':
      case 'arrows':
      case 'pyramid':
      case 'staircase':
        if (newContent.steps?.[index]) {
          newContent.steps[index][field] = value;
        }
        break;
      case 'chart':
        if (newContent.data?.[index]) {
          newContent.data[index][field] = value;
        }
        break;
    }
    
    updateContent(newContent);
  };

  const getItems = () => {
    switch (layoutType) {
      case 'columns':
        return content.columns || [];
      case 'bullets':
        return content.bullets || [];
      case 'icons':
        return content.icons || [];
      case 'timeline':
      case 'cycle':
      case 'arrows':
      case 'pyramid':
      case 'staircase':
        return content.steps || [];
      case 'chart':
        return content.data || [];
      default:
        return [];
    }
  };

  const renderItemEditor = (item: any, index: number) => {
    const isEditing = editingItem === index;

    switch (layoutType) {
      case 'columns':
        return (
          <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Column {index + 1}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingItem(isEditing ? null : index)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 hover:bg-red-700 rounded text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.heading || ''}
                  onChange={(e) => updateItem(index, 'heading', e.target.value)}
                  placeholder="Column heading"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
                <textarea
                  value={item.description || ''}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Column description"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm resize-none"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-medium text-white text-sm">{item.heading}</div>
                <div className="text-gray-300 text-xs">{item.description}</div>
              </div>
            )}
          </div>
        );

      case 'bullets':
        return (
          <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Bullet {index + 1}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingItem(isEditing ? null : index)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 hover:bg-red-700 rounded text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.heading || ''}
                  onChange={(e) => updateItem(index, 'heading', e.target.value)}
                  placeholder="Bullet heading"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
                <textarea
                  value={item.text || ''}
                  onChange={(e) => updateItem(index, 'text', e.target.value)}
                  placeholder="Bullet text"
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm resize-none"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-medium text-white text-sm">{item.heading}</div>
                <div className="text-gray-300 text-xs">{item.text}</div>
              </div>
            )}
          </div>
        );

      case 'icons':
        return (
          <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Icon {index + 1}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingItem(isEditing ? null : index)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 hover:bg-red-700 rounded text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.icon || ''}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                  placeholder="Icon keyword (e.g., rocket, star)"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
                <input
                  type="text"
                  value={item.heading || ''}
                  onChange={(e) => updateItem(index, 'heading', e.target.value)}
                  placeholder="Icon heading"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
                <textarea
                  value={item.description || ''}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Icon description"
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm resize-none"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <div className="font-medium text-white text-sm">{item.heading}</div>
                </div>
                <div className="text-gray-300 text-xs">{item.description}</div>
              </div>
            )}
          </div>
        );

      case 'chart':
        return (
          <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Data {index + 1}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingItem(isEditing ? null : index)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 hover:bg-red-700 rounded text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={(e) => updateItem(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
                <input
                  type="number"
                  value={item.data || ''}
                  onChange={(e) => updateItem(index, 'data', e.target.value)}
                  placeholder="Value"
                  min="0"
                  max="100"
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="font-medium text-white text-sm">{item.label}</div>
                <div className="text-gray-300 text-sm">{item.data}%</div>
              </div>
            )}
          </div>
        );

      default: // timeline, cycle, arrows, pyramid, staircase
        return (
          <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Step {index + 1}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingItem(isEditing ? null : index)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 hover:bg-red-700 rounded text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="Step title"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
                <textarea
                  value={item.description || ''}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Step description"
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm resize-none"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-medium text-white text-sm">{item.title}</div>
                <div className="text-gray-300 text-xs">{item.description}</div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Type className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-semibold">Content</h3>
      </div>

      {/* Title Editor */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Title</label>
        <input
          type="text"
          value={content.title || content.heading || ''}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Slide title"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Items Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">
            {layoutType === 'columns' ? 'Columns' :
             layoutType === 'bullets' ? 'Bullet Points' :
             layoutType === 'icons' ? 'Icons' :
             layoutType === 'chart' ? 'Data Points' :
             'Steps'}
          </label>
          <button
            onClick={addItem}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
          {getItems().map((item: any, index: number) => renderItemEditor(item, index))}
        </div>

        {getItems().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Type className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No content items yet</p>
            <p className="text-xs">Click "Add" to create your first item</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;