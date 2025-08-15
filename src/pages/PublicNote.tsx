import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Globe } from 'lucide-react';
import { publicAPI } from '../services/api';

interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  isAnonymous: boolean;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

const PublicNote = () => {
  const { slug } = useParams<{ slug: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadNote(slug);
    }
  }, [slug]);

  const loadNote = async (noteSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicAPI.getPublicNote(noteSlug);
      setNote(response.note);
    } catch (error: any) {
      setError(error.message || 'ไม่สามารถโหลดบันทึกได้');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 theme-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับไปหน้าแรก</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ไม่พบบันทึก
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            บันทึกที่คุณกำลังมองหาไม่มีอยู่หรือไม่ได้เปิดเป็นสาธารณะ
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 theme-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับไปหน้าแรก</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>กลับไปบันทึกสาธารณะ</span>
        </Link>
      </div>

      {/* Note Content */}
      <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Globe className="h-4 w-4" />
            <span>บันทึกสาธารณะ</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {note.title}
          </h1>

          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(note.createdAt)}</span>
            </div>

            {note.author && !note.isAnonymous ? (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>โดย {note.author.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="italic">ไม่ระบุชื่อ</span>
              </div>
            )}
          </div>
        </header>

        {note.imageUrl && (
          <div className="mb-8">
            <img
              src={note.imageUrl}
              alt={note.title}
              className="w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="text-gray-800 dark:text-gray-200">
            {formatContent(note.content)}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>แชร์บน NNote - แพลตฟอร์มสำหรับการแชร์บันทึกและความรู้</p>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PublicNote;
