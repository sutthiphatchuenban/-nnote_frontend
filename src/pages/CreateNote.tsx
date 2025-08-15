import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Eye, EyeOff, User, UserX, Upload, Image as ImageIcon, XCircle } from 'lucide-react';
import { notesAPI } from '../services/api';

const CreateNote = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: false,
    isAnonymous: false,
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('กรุณากรอกชื่อเรื่องและเนื้อหา');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadResult = await notesAPI.uploadImage(imageFile);
          finalImageUrl = uploadResult.imageUrl;
        } catch (uploadError: any) {
          alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message || 'เกิดข้อผิดพลาด'}`);
          setLoading(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      await notesAPI.createNote({ ...formData, imageUrl: finalImageUrl });
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.message || 'สร้างบันทึกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>กลับไปบันทึกของฉัน</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          สร้างบันทึกใหม่
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ชื่อเรื่อง
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="ชื่อเรื่องของบันทึก..."
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              เนื้อหา
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="เขียนบันทึกของคุณที่นี่..."
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              รูปภาพประกอบ (ไม่บังคับ)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="image-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <div className="w-4 h-4 border-2 border-gray-700 dark:border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>{uploadingImage ? 'กำลังอัปโหลด...' : 'เลือกรูปภาพ'}</span>
              </button>
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Image Preview" className="h-20 w-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
              {formData.imageUrl && !imagePreview && (
                <div className="relative">
                  <img src={formData.imageUrl} alt="Existing Image" className="h-20 w-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {imageFile && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                ไฟล์ที่เลือก: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                {formData.isPublic ? (
                  <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <span>แชร์เป็นสาธารณะ (ทุกคนสามารถเข้าชมได้)</span>
              </label>
            </div>

            {formData.isPublic && (
              <div className="flex items-center space-x-3 ml-7">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAnonymous" className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  {formData.isAnonymous ? (
                    <UserX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                  <span>ไม่ระบุชื่อผู้เขียน (แสดงเป็นไม่ระบุตัวตน)</span>
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex items-center space-x-2 px-6 py-2 btn-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {(loading || uploadingImage) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{(loading || uploadingImage) ? 'กำลังบันทึก...' : 'บันทึก'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;
